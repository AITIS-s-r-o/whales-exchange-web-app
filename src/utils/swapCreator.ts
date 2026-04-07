import { sha256 } from "@noble/hashes/sha2.js";
import { hex } from "@scure/base";
import type BigNumber from "bignumber.js";
import { OutputType } from "boltz-core";

import { type AssetType, RBTC } from "../consts/Assets";
import { SwapType } from "../consts/Enums";
import type { newKeyFn } from "../context/Global";
import type {
    ChainSwapCreatedResponse,
    Pairs,
    ReverseCreatedResponse,
    SubmarineCreatedResponse,
} from "./boltzClient";
import {
    createChainSwap,
    createReverseSwap,
    createSubmarineSwap,
} from "./boltzClient";
import { getPair } from "./helper";
import { type RescueFile, derivePreimageFromRescueKey } from "./rescueFile";
import type { WexSwapProvider } from "../utils/wexClient";

export type SwapBase = {
    type: SwapType;
    status?: string;
    assetSend: string;
    assetReceive: string;
    sendAmount: number;
    receiveAmount: number;
    version: number;
    date: number;

    // Not set for submarine swaps; but set for interface compatibility
    claimTx?: string;
    lockupTx?: string;

    useRif: boolean;
    signer?: string;
    // Set for hardware wallet signers
    derivationPath?: string;

    // Original user input (Lightning address/LNURL/BIP353/BOLT12) before resolution
    originalDestination?: string;
};

export type SubmarineSwap = SwapBase &
    SubmarineCreatedResponse & {
        invoice: string;
        preimage?: string;
        refundPrivateKeyIndex?: number;

        // Deprecated; used for backwards compatibility
        refundPrivateKey?: string;
    };

export type ReverseSwap = SwapBase &
    ReverseCreatedResponse & {
        preimage: string;
        claimAddress: string;
        claimPrivateKeyIndex?: number;

        // Deprecated; used for backwards compatibility
        claimPrivateKey?: string;
    };

export type ChainSwap = SwapBase &
    ChainSwapCreatedResponse & {
        preimage: string;
        claimAddress: string;
        claimPrivateKeyIndex?: number;
        refundPrivateKeyIndex?: number;
        magicRoutingHintSavedFees?: string;

        // Deprecated; used for backwards compatibility
        claimPrivateKey?: string;
        refundPrivateKey?: string;
    };

export type SomeSwap = SubmarineSwap | ReverseSwap | ChainSwap;

export const getRelevantAssetForSwap = (swap: SwapBase) => {
    switch (swap.type) {
        case SwapType.Submarine:
            return swap.assetSend;

        default:
            return swap.assetReceive;
    }
};

export const isRsk = (swap: SomeSwap) => getRelevantAssetForSwap(swap) === RBTC;

const generatePreimage = ({
    asset,
    keyIndex,
    rescueFile,
}: {
    asset: AssetType;
    keyIndex: number;
    rescueFile: RescueFile;
}) => {
    return derivePreimageFromRescueKey(rescueFile, keyIndex, asset);
};

export const createSubmarine = async (
    pairs: Pairs,
    assetSend: string,
    assetReceive: string,
    sendAmount: BigNumber,
    receiveAmount: BigNumber,
    invoice: string,
    useRif: boolean,
    newKey: newKeyFn,
    originalDestination?: string,
): Promise<SubmarineSwap> => {
    const key = await newKey(assetSend as AssetType);
    const res = await createSubmarineSwap(
        assetSend,
        assetReceive,
        invoice,
        getPair(pairs, SwapType.Submarine, assetSend, assetReceive).hash,
        key !== undefined
            ? Buffer.from(key.key.publicKey).toString("hex")
            : undefined,
    );

    return {
        ...annotateSwapBaseData(
            res,
            SwapType.Submarine,
            assetSend,
            assetReceive,
            sendAmount,
            receiveAmount,
            useRif,
        ),
        invoice,
        originalDestination,
        refundPrivateKeyIndex: key?.index,
    };
};

export const createReverse = async (
    provider: WexSwapProvider,
    pairs: Pairs,
    assetSend: string,
    assetReceive: string,
    sendAmount: BigNumber,
    receiveAmount: BigNumber,
    claimAddress: string,
    useRif: boolean,
    rescueFile: RescueFile,
    newKey: newKeyFn,
    originalDestination?: string,
): Promise<ReverseSwap> => {
    console.log("[swapCreator.createReverse] * provider=%o, pairs=%o, assetSend=%s, assetReceive=%s, sendAmount=%o, receiveAmount=%o, claimAddress=%o, useRif=%o, rescueFile=%o, originalDestination=%o",
        provider, pairs, assetSend, assetReceive, sendAmount, receiveAmount, claimAddress, useRif, rescueFile, originalDestination);

    const key = await newKey(assetReceive as AssetType);
    const preimage = generatePreimage({
        asset: assetReceive as AssetType,
        keyIndex: key?.index,
        rescueFile,
    });

    console.log("[swapCreator.createReverse] preimage is '%s'.", hex.encode(preimage));

    const res = await createReverseSwap(
        provider,
        assetSend,
        assetReceive,
        Number(sendAmount),
        Number(receiveAmount),
        hex.encode(sha256(preimage)),
        getPair(pairs, SwapType.Reverse, assetSend, assetReceive).hash,
        key !== undefined
            ? Buffer.from(key.key.publicKey).toString("hex")
            : undefined,
        claimAddress,
    );

    console.log("[swapCreator.createReverse] Response is: %o", res);

    const result = {
        ...annotateSwapBaseData(
            res,
            SwapType.Reverse,
            assetSend,
            assetReceive,
            sendAmount,
            receiveAmount,
            useRif,
        ),
        claimAddress,
        originalDestination,
        preimage: hex.encode(preimage),
        claimPrivateKeyIndex: key?.index,
    };

    console.log("[swapCreator.createReverse] $=%o", result);
    return result;
};

export const createChain = async (
    pairs: Pairs,
    assetSend: string,
    assetReceive: string,
    sendAmount: BigNumber,
    receiveAmount: BigNumber,
    claimAddress: string,
    useRif: boolean,
    rescueFile: RescueFile,
    newKey: newKeyFn,
    originalDestination?: string,
): Promise<ChainSwap> => {
    const claimKey = await newKey(assetReceive as AssetType);
    const refundKey = await newKey(assetSend as AssetType);
    const preimage = generatePreimage({
        asset: assetReceive as AssetType,
        keyIndex: claimKey?.index,
        rescueFile,
    });
    const res = await createChainSwap(
        assetSend,
        assetReceive,
        sendAmount.isZero() || sendAmount.isNaN()
            ? undefined
            : Number(sendAmount),
        hex.encode(sha256(preimage)),
        claimKey !== undefined
            ? Buffer.from(claimKey.key.publicKey).toString("hex")
            : undefined,
        refundKey !== undefined
            ? Buffer.from(refundKey.key.publicKey).toString("hex")
            : undefined,
        claimAddress,
        getPair(pairs, SwapType.Chain, assetSend, assetReceive).hash,
    );

    return {
        ...annotateSwapBaseData(
            res,
            SwapType.Chain,
            assetSend,
            assetReceive,
            sendAmount,
            receiveAmount,
            useRif,
        ),
        claimAddress,
        originalDestination,
        preimage: hex.encode(preimage),
        claimPrivateKeyIndex: claimKey?.index,
        refundPrivateKeyIndex: refundKey?.index,
    };
};

const annotateSwapBaseData = <T>(
    createdResponse: T,
    type: SwapType,
    assetSend: string,
    assetReceive: string,
    sendAmount: BigNumber,
    receiveAmount: BigNumber,
    useRif: boolean,
): T & SwapBase => ({
    ...createdResponse,
    type,
    useRif,
    assetSend,
    assetReceive,
    date: new Date().getTime(),
    version: OutputType.Taproot,
    sendAmount: Number(sendAmount),
    receiveAmount: Number(receiveAmount),
});
