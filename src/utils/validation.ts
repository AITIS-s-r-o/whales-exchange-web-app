import log from "loglevel";
import { secp256k1 } from "@noble/curves/secp256k1.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { hex } from "@scure/base";
import { equalBytes } from "@scure/btc-signer/utils.js";
import { BigNumber } from "bignumber.js";
import type { Types } from "boltz-core";
import { swapScript, reverseSwapScript } from "boltz-core";
import {
    Scripts,
    SwapTreeSerializer,
    compareTrees,
    reverseSwapTree,
    swapTree,
} from "boltz-core";
import type { BaseContract } from "ethers";
import { ethers } from "ethers";
import { script } from "liquidjs-lib";
import { type AssetType, LBTC, RBTC } from "../consts/Assets";
import { Denomination, Side, SwapType } from "../consts/Enums";
import type { deriveKeyFn } from "../context/Global";
import { etherSwapCodeHashes } from "../context/Web3";
import type { ChainSwapDetails } from "./boltzClient";
import { decodeAddress } from "./compat";
import { formatAmountDenomination, satToBtc } from "./denomination";
import type { ECKeys } from "./ecpair";
import { decodeInvoice, isInvoice, isLnurl } from "./invoice";
import type {
    ChainSwap,
    ReverseSwap,
    SomeSwap,
    SubmarineSwap,
} from "./swapCreator";
import { createMusig, tweakMusig } from "./taproot/musig";

// TODO: sanity check timeout block height?
// TODO: buffers for amounts

const invalidSendAmountMsg = (expected: number, got: number) =>
    `invalid send amount. Expected ${expected}, got ${got}`;
const invalidReceiveAmountMsg = (expected: number, got: number) =>
    `invalid receive amount. Expected ${expected} to be bigger than ${got}`;

type ContractGetter = () => BaseContract;

const validateContract = async (
    getEtherSwap: ContractGetter,
): Promise<void> => {
    const codeHashes = etherSwapCodeHashes();
    if (codeHashes === undefined) {
        return;
    }

    const code = await getEtherSwap().getDeployedCode();
    if (!codeHashes.includes(ethers.keccak256(code))) {
        throw new Error(`invalid contract code: ${code}`);
    }
};

const validateAddress = (
    chain: string,
    tree: Types.SwapTree,
    ourKeys: ECKeys,
    theirPublicKey: Uint8Array,
    address: string,
    blindingKey: string | undefined,
): void => {
    const keyAgg = createMusig(ourKeys, theirPublicKey);
    const tweaked = tweakMusig(chain, keyAgg, tree.tree);

    const compareScript = Scripts.p2trOutput(tweaked.aggPubkey);
    const decodedAddress = decodeAddress(chain, address);

    if (!equalBytes(decodedAddress.script, compareScript)) {
        throw new Error("decoded address script mismatch");
    }

    if (chain === LBTC) {
        if (!blindingKey) {
            throw new Error("missing blindingKey for LBTC address validation");
        }
        const blindingPrivateKey = hex.decode(blindingKey);
        const blindingPublicKey = secp256k1.getPublicKey(blindingPrivateKey);

        if (!equalBytes(decodedAddress.blindingKey, blindingPublicKey)) {
            throw new Error("blinding public key mismatch");
        }
    }
};

const getScriptHashFunction = (isNativeSegwit: boolean) =>
    isNativeSegwit ? Scripts.p2wshOutput : Scripts.p2shP2wshOutput;

// v1.2.1 code.
const validateAddressV1 = (
    swap: SubmarineSwap | ReverseSwap,
    isNativeSegwit: boolean,
    address: string
) => {
    log.debug(`[validation.validateAddressV1] * swap=%o,isNativeSegwit=${isNativeSegwit},address=${address}`, swap);

    const redeemScriptArray = hex.decode(swap.redeemScript);
    const compareScript = getScriptHashFunction(isNativeSegwit)(
        Buffer.from(redeemScriptArray),
    );
    const decodedAddress = decodeAddress(swap.assetReceive, address);

    log.debug(`[validation.validateAddressV1] Decoded address:`, decodedAddress);

    if (!equalBytes(decodedAddress.script, compareScript)) {
        log.debug(`[validation.validateAddressV1] $<ADDRESS_VALIDATION_FAILED>`);
        return false;
    }

    log.debug(`[validation.validateAddressV1] $`);
    return true;
};

const validateBip21 = (
    bip21: string,
    address: string,
    expectedAmount: number,
): void => {
    const bip21Split = bip21.split("?");
    if (bip21Split[0].split(":")[1] !== address) {
        throw new Error("invalid BIP21 format");
    }

    const params = new URLSearchParams(bip21Split[1]);

    if (expectedAmount === 0) {
        const hasAmount = params.has("amount");
        if (hasAmount) {
            throw new Error(
                `unexpected amount in BIP21. Expected 0, got ${params.get("amount")}`,
            );
        }
        return;
    }

    if (
        params.get("amount") !==
        formatAmountDenomination(
            BigNumber(expectedAmount),
            Denomination.Btc,
            ".",
        )
    ) {
        throw new Error(
            `invalid BIP21 amount. Expected ${expectedAmount}, got ${params.get("amount")}`,
        );
    }
};

const validateReverse = async (
    swap: ReverseSwap,
    deriveKey: deriveKeyFn,
    getEtherSwap: ContractGetter,
): Promise<void> => {
    log.debug(`[validation.validateReverse] * swap=`, swap);

    const invoiceData = await decodeInvoice(swap.invoice);
    log.debug(`[validation.validateReverse] Invoice data is`, invoiceData);

    const feeInvoiceData = await decodeInvoice(swap.feeInvoice);
    log.debug(`[validation.validateReverse] Fee invoice data is`, feeInvoiceData);

    // Amounts
    if (invoiceData.satoshis + feeInvoiceData.satoshis !== swap.sendAmount) {
        log.debug(`[validation.validateReverse] Invoice amount ${invoiceData.satoshis} + fee invoice amount ${feeInvoiceData.satoshis} does not equal send amount `
            + `${swap.sendAmount}.`);
        log.debug(`[validation.validateReverse] $<INVALID_SEND_AMOUNTS>`);

        throw new Error(
            invalidSendAmountMsg(invoiceData.satoshis + feeInvoiceData.satoshis, swap.sendAmount),
        );
    }

    if (swap.onchainAmount <= swap.receiveAmount) {
        log.debug(`[validation.validateReverse] On chain amount ${swap.onchainAmount} is not greater than receive amount ${swap.receiveAmount}.`);
        log.debug(`[validation.validateReverse] $<INVALID_RCV_AMOUNT>`);

        throw new Error(
            invalidReceiveAmountMsg(swap.onchainAmount, swap.receiveAmount),
        );
    }

    // Invoice
    const preimageHash = sha256(hex.decode(swap.preimage));
    if (invoiceData.preimageHash !== hex.encode(preimageHash)) {
        log.debug(`[validation.validateReverse] Invoice data preimage hash ${invoiceData.preimageHash} does not match expected preimage hash ${hex.encode(preimageHash)}.`);
        log.debug(`[validation.validateReverse] $<INVALID_PREIMAGE_HASH>`);

        throw new Error(
            `invalid swap preimage hash. Expected ${hex.encode(preimageHash)}, got ${invoiceData.preimageHash}`,
        );
    }

    const ourKeys = deriveKey(
        swap.claimPrivateKeyIndex,
        swap.assetReceive as AssetType,
    );

    // Redeem script
    const redeemScript = hex.decode(swap.redeemScript);

    const decompiledRedeemScript = script.decompile(Buffer.from(redeemScript));
    const refundPublicKey = decompiledRedeemScript[13] as Buffer;

    const compareRedeemScript = reverseSwapScript(
        preimageHash,
        ourKeys.publicKey, // In v1.2.1 it is: ECPair.fromPrivateKey(hex.decode(swap.privateKey)).publicKey,
        refundPublicKey, // Note: swap.refundPublicKey is null.
        swap.timeoutBlockHeight,
    );

    if (!equalBytes(redeemScript, compareRedeemScript)) {
        log.debug(`[validation.validateReverse] Redeem script does not match expected script.`, redeemScript, compareRedeemScript);
        log.debug(`[validation.validateReverse] $<REDEEM_SCRIPT_NOT_EQUAL>`);

        throw new Error(`invalid redeem script. Expected ${swap.redeemScript}, got ${compareRedeemScript.toString()}`);
    }

    const result = validateAddressV1(swap, true, swap.lockupAddress);
    if (!result) {
        log.debug(`[validation.validateReverse] Address validation failed for swap`, swap);
        log.debug(`[validation.validateReverse] $<ADDRESS_VALIDATION_FAILED>`);

        throw new Error(`invalid address. Expected '${swap.lockupAddress}'.`);
    }

    log.debug(`[validation.validateReverse] $`);
};

const validateSubmarine = async (
    swap: SubmarineSwap,
    deriveKey: deriveKeyFn,
    getEtherSwap: ContractGetter,
): Promise<void> => {
    swap.address = swap.lockupAddress;
    swap.bip21 = makeBip21(swap)
    swap.expectedAmount = swap.onchainAmount;

    // Amounts
    if (swap.onchainAmount !== swap.sendAmount) {
        throw new Error(
            invalidSendAmountMsg(swap.onchainAmount, swap.sendAmount),
        );
    }

    const ourKeys = deriveKey(
        swap.refundPrivateKeyIndex,
        swap.assetSend as AssetType,
    );

    const invoiceData = await decodeInvoice(swap.invoice);

    const redeemScript = hex.decode(swap.redeemScript);
    const decompiledRedeemScript = script.decompile(Buffer.from(redeemScript));
    const compareRedeemScript = swapScript(
        hex.decode(invoiceData.preimageHash),
        decompiledRedeemScript[4] as Buffer,
        ourKeys.publicKey,
        swap.timeoutBlockHeight,
    );

    if (!equalBytes(redeemScript, compareRedeemScript)) {
        log.debug("[CreateButton.validateSubmarine] $<REDEEM_SCRIPT_NOT_EQUAL>", redeemScript, compareRedeemScript);
        throw new Error("swap address validation: redeem script mismatch");
    }

    // Address
    const addressComparisons = [true, false].map((isNativeSegwit) =>
        validateAddressV1(swap, isNativeSegwit, swap.address),
    );
    if (addressComparisons.every((val) => !val)) {
        log.debug("[CreateButton.validateSubmarine] $<DIFFERENT_ADDRESSES>");
        throw new Error("swap address validation: address script mismatch");
    }
};

const makeBip21 = (swap: SubmarineSwap): string => {
    const sats = satToBtc(new BigNumber(swap.sendAmount));
    return `bitcoin:${swap.lockupAddress}?amount=${sats}`;
}

const validateChainSwap = async (
    swap: ChainSwap,
    deriveKey: deriveKeyFn,
    getEtherSwap: ContractGetter,
): Promise<void> => {
    const preimageHash = sha256(hex.decode(swap.preimage));

    const validateSide = async (
        side: Side,
        asset: string,
        details: ChainSwapDetails,
    ): Promise<void> => {
        if (side === Side.Send) {
            if (swap.sendAmount > 0 && details.amount !== swap.sendAmount) {
                throw new Error(
                    invalidSendAmountMsg(swap.sendAmount, details.amount),
                );
            }
        } else {
            if (
                swap.receiveAmount > 0 &&
                details.amount <= swap.receiveAmount
            ) {
                throw new Error(
                    invalidReceiveAmountMsg(swap.receiveAmount, details.amount),
                );
            }
        }

        if (asset === RBTC) {
            await validateContract(getEtherSwap);
            return;
        }

        const ourKeys = deriveKey(
            side === Side.Send
                ? swap.refundPrivateKeyIndex
                : swap.claimPrivateKeyIndex,
            asset as AssetType,
        );
        const theirPublicKey = hex.decode(details.serverPublicKey);
        const tree = SwapTreeSerializer.deserializeSwapTree(details.swapTree);
        const compareTree = reverseSwapTree(
            asset === LBTC,
            preimageHash,
            side === Side.Send ? theirPublicKey : ourKeys.publicKey,
            side === Side.Send ? ourKeys.publicKey : theirPublicKey,
            details.timeoutBlockHeight,
        );

        if (!compareTrees(tree, compareTree)) {
            throw new Error("swap tree mismatch");
        }

        validateAddress(
            asset,
            tree,
            ourKeys,
            theirPublicKey,
            details.lockupAddress,
            details.blindingKey,
        );

        if (side === Side.Send) {
            validateBip21(details.bip21, details.lockupAddress, details.amount);
        }
    };

    await Promise.all([
        validateSide(Side.Send, swap.assetSend, swap.lockupDetails),
        validateSide(Side.Receive, swap.assetReceive, swap.claimDetails),
    ]);
};

export const validateResponse = async (
    swap: SomeSwap,
    deriveKey: deriveKeyFn,
    getEtherSwap: ContractGetter,
): Promise<void> => {
    log.debug("[CreateButton.validateResponse] * swap=%o", swap);

    switch (swap.type) {
        case SwapType.Submarine:
            await validateSubmarine(
                swap as SubmarineSwap,
                deriveKey,
                getEtherSwap,
            );
            break;

        case SwapType.Reverse:
            await validateReverse(swap as ReverseSwap, deriveKey, getEtherSwap);
            break;

        case SwapType.Chain:
            await validateChainSwap(swap as ChainSwap, deriveKey, getEtherSwap);
            break;

        default:
            throw new Error("unknown_swap_type");
    }

    log.debug("[CreateButton.validateResponse] $");
};

export const validateInvoice = async (inputValue: string) => {
    const isInputInvoice = isInvoice(inputValue);
    if (isLnurl(inputValue) || isInputInvoice) {
        if (isInputInvoice) {
            const decoded = await decodeInvoice(inputValue);
            if (decoded.satoshis === 0) {
                throw new Error("invalid_0_amount");
            }
            return decoded.satoshis;
        }
    }
    throw new Error("invalid_invoice");
};
