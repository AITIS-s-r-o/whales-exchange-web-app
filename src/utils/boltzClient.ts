import { hex } from "@scure/base";
import log from "loglevel";

import { config } from "../config";
import { SwapType } from "../consts/Enums";
import { broadcastToExplorer } from "./blockchain";
import type { TransactionInterface } from "./compat";
import { txToHex } from "./compat";
import { fetcher, getReferral } from "./helper";
import { validateInvoiceForOffer } from "./invoice";
import type { WexSwapProvider, WexCreateReverseSwapResponse } from "./wexClient";

const cooperativeErrorMessage = "cooperative signatures for swaps are disabled";
const checkCooperative = () => {
    if (config.cooperativeDisabled === true) {
        throw new Error(cooperativeErrorMessage);
    }
};

type ReverseMinerFees = {
    lockup: number;
    claim: number;
};

type PairLimits = {
    minimal: number;
    maximal: number;
};

type PairType = {
    hash: string;
    rate: number;
};

type SubmarinePairTypeTaproot = PairType & {
    limits: PairLimits & {
        maximalZeroConf: number;
        minimalBatched?: number;
    };
    fees: {
        minerFees: number;
        percentage: number;
        maximalRoutingFee?: number;
    };
};

type ReversePairTypeTaproot = PairType & {
    limits: PairLimits;
    fees: {
        percentage: number;
        minerFees: ReverseMinerFees;
    };
};

type ChainPairTypeTaproot = PairType & {
    limits: PairLimits & {
        maximalZeroConf: number;
    };
    fees: {
        percentage: number;
        minerFees: {
            server: number;
            user: {
                claim: number;
                lockup: number;
            };
        };
    };
};

type SubmarinePairsTaproot = Record<
    string,
    Record<string, SubmarinePairTypeTaproot>
>;

type ReversePairsTaproot = Record<
    string,
    Record<string, ReversePairTypeTaproot>
>;

type ChainPairsTaproot = Record<string, Record<string, ChainPairTypeTaproot>>;

type Pairs = {
    [SwapType.Submarine]: SubmarinePairsTaproot;
    [SwapType.Reverse]: ReversePairsTaproot;
    [SwapType.Chain]: ChainPairsTaproot;
};

type PartialSignature = {
    pubNonce: Uint8Array;
    signature: Uint8Array;
};

type Contracts = {
    network: {
        chainId: number;
        name: string;
    };
    swapContracts: {
        EtherSwap: string;
        ERC20Swap: string;
    };
    supportedContracts: Record<
        string,
        {
            EtherSwap: string;
            ERC20Swap: string;
            features: string[];
        }
    >;
    tokens: Record<string, string>;
};

type SwapTreeLeaf = {
    output: string;
    version: number;
};

type SwapTree = {
    claimLeaf: SwapTreeLeaf;
    refundLeaf: SwapTreeLeaf;
};

type SubmarineCreatedResponse = {
    id: string;
    address: string;
    bip21: string;
    swapTree: SwapTree;
    acceptZeroConf: boolean;
    expectedAmount: number;
    claimPublicKey: string;
    timeoutBlockHeight: number;
    blindingKey?: string;
    claimAddress?: string;
};

type ReverseCreatedResponse = {
    id: string;
    invoice: string;
    feeInvoice: string;
    swapTree: SwapTree;
    lockupAddress: string;
    timeoutBlockHeight: number;
    onchainAmount: number;
    redeemScript?: string | null;
    privateKey: string | null;
    refundPublicKey?: string;
    blindingKey?: string;
    refundAddress?: string;
};

type ChainSwapDetails = {
    swapTree: SwapTree;
    lockupAddress: string;
    serverPublicKey: string;
    timeoutBlockHeight: number;
    amount: number;
    blindingKey?: string;
    refundAddress?: string;
    claimAddress?: string;
    bip21?: string;
};

type ChainSwapCreatedResponse = {
    id: string;
    claimDetails: ChainSwapDetails;
    lockupDetails: ChainSwapDetails;
};

type ChainSwapTransaction = {
    transaction: {
        id: string;
        hex?: string;
    };
    timeout: {
        blockHeight: number;
        eta?: number;
    };
};

type RestorableSwapDetails = {
    tree: SwapTree;
    keyIndex: number;
    lockupAddress: string;
    serverPublicKey: string;
    timeoutBlockHeight: number;
    blindingKey?: string;
    amount?: number;
    transaction?: { id: string; vout: number };
    preimageHash?: string;
};

export type RestorableSwap = {
    id: string;
    type: SwapType;
    status: string;
    from: string;
    to: string;
    createdAt: number;
    claimPrivateKey?: string;
    claimDetails?: RestorableSwapDetails;
    refundDetails?: RestorableSwapDetails;
};

export type LockupTransaction = {
    id: string;
    hex: string;
    timeoutBlockHeight: number;
    timeoutEta?: number;
};

export type SwapStatus = {
    status: string;
    failureReason?: string;
    zeroConfRejected?: boolean;
    transaction?: {
        id: string;
        hex: string;
    };
};


/** Reference to the signal getter from Create.tsx. */
let wexGetSelectedProvider: (() => WexSwapProvider | null) | null = null;

/**
 * Initializes the provider signal for use by `getPairs()`.
 * 
 * This function must be called once during application startup (typically in `Create.tsx`) to connect the selected provider signal from the UI to the boltzClient.
 * 
 * After calling this, `getPairs()` will dynamically build swap pairs based on the currently selected provider instead of fetching them from the server.
 * 
 * @param getProvider - Getter function that returns the currently selected provider.
 */
export function wexInitProviderSignal(getProvider: () => WexSwapProvider | null): void {
    wexGetSelectedProvider = getProvider;
}

/* WEX
export const getPairs = async (options?: RequestInit): Promise<Pairs> => {
    const [submarine, reverse, chain] = await Promise.all([
        fetcher<SubmarinePairsTaproot>("/v2/swap/submarine", null, options),
        fetcher<ReversePairsTaproot>("/v2/swap/reverse", null, options),
        fetcher<ChainPairsTaproot>("/v2/swap/chain", null, options),
    ]);

    return {
        [SwapType.Chain]: chain,
        [SwapType.Reverse]: reverse,
        [SwapType.Submarine]: submarine,
    };
};*/

/**
 * Retrieves swap pairs configuration based on the currently selected provider.
 * 
 * Unlike the original implementation that fetched pairs from the Boltz API, this version uses the user-selected WexSwapProvider to dynamically build the submarine and reverse
 * swap pairs.
 *
 * Chain swaps are intentionally returned as empty since LBTC/RBTC are not supported in this fork.
 *
 * The method waits until a provider is selected.
 *
 * @param options - Optional fetch options (RequestInit) for future compatibility. Currently not used as we no longer make network requests.
 * 
 * @returns Pairs object containing:
 *   - `submarine`: Submarine swap pairs (BTC → LN) built from selected provider
 *   - `reverse`: Reverse swap pairs (LN → BTC) built from selected provider
 *   - `chain`: Always an empty object (chain swaps not supported)
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPairs = async (options?: RequestInit): Promise<Pairs> => {
    if (!wexGetSelectedProvider) {
        log.debug("getPairs: Waiting for provider selection...");

        // Wait for provider to be selected (polling every 100ms).
        await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
                if (wexGetSelectedProvider) {
                    const checkProvider: WexSwapProvider | null = wexGetSelectedProvider!();
                    if (checkProvider) {
                        clearInterval(interval);
                        resolve();
                    }
                }
            }, 50);

            setTimeout(() => clearInterval(interval), 10000);
        });
    }

    const provider: WexSwapProvider | null = wexGetSelectedProvider!();

    // Submarine Pairs (Forward Swap: BTC → LN).
    const submarinePair: SubmarinePairTypeTaproot = {
        hash: provider.pk,
        rate: 1,
        limits: {
            maximal: provider.fwdMax,
            minimal: provider.fwdMin,
            maximalZeroConf : 0,
        },
        fees: {
            percentage: provider.fwdFee,
            minerFees: provider.fwdMining,
        },
    };

    const submarineBtcPair: Record<string, SubmarinePairTypeTaproot> = {
        ["BTC"]: submarinePair
    };

    const submarine: SubmarinePairsTaproot = {
        ["BTC"]: submarineBtcPair
    };

    // Reverse Pairs (Reverse Swap: LN → BTC).
    const reversePair: ReversePairTypeTaproot = {
        hash: provider.pk,
        rate: 1,
        limits: {
            maximal: provider.revMax,
            minimal: provider.revMin,
        },
        fees: {
            percentage: provider.revFee,
            minerFees: {
                claim: provider.revMining,
                lockup: provider.revMining,
            }
        },
    }

    const reverseBtcPair: Record<string, ReversePairTypeTaproot> = {
        ["BTC"]: reversePair
    };

    const reverse: ReversePairsTaproot = {
        ["BTC"]: reverseBtcPair,
    };

    // Chain swaps are always empty
    const chain = {} as const;

    return {
        [SwapType.Chain]: chain,
        [SwapType.Reverse]: reverse,
        [SwapType.Submarine]: submarine,
    };
};

export const fetchBolt12Invoice = async (
    offer: string,
    amountSat: number,
): Promise<{ invoice: string }> => {
    const res = await fetcher<{ invoice: string }>(
        "/v2/lightning/BTC/bolt12/fetch",
        {
            offer,
            amount: amountSat,
        },
    );
    await validateInvoiceForOffer(offer, res.invoice);

    return res;
};

export const fetchBip21Invoice = async (invoice: string) => {
    try {
        log.debug("Fetching BIP21 for invoice", invoice);
        const res = await fetcher<{ bip21: string; signature: string }>(
            `/v2/swap/reverse/${invoice}/bip21`,
        );
        return res;
    } catch {
        log.debug("No BIP21 found for invoice");
        return null;
    }
};

export const createSubmarineSwap = (
    from: string,
    to: string,
    invoice: string,
    pairHash: string,
    refundPublicKey?: string,
): Promise<SubmarineCreatedResponse> =>
    fetcher("/v2/swap/submarine", {
        from,
        to,
        invoice,
        refundPublicKey,
        pairHash,
        referralId: getReferral(),
    });

export const createReverseSwap = async (
    provider: WexSwapProvider,
    from: string,
    to: string,
    invoiceAmount: number,
    receiveAmount: number,
    preimageHash: string,
    pairHash: string,
    claimPublicKey?: string,
    claimAddress?: string,
): Promise<ReverseCreatedResponse> => {
    console.log("[swapCreator.createReverseSwap] * provider.pk=%s, from=%s, to=%s, invoiceAmount=%d, receiveAmount=%d, preimageHash=%s, pairHash=%s, claimPublicKey=%s, claimAddress=%s",
        provider.pk, from, to, invoiceAmount, receiveAmount, preimageHash, pairHash, claimPublicKey, claimAddress);

    /* WEX
    return fetcher("/v2/swap/reverse", {
        from,
        to,
        invoiceAmount,
        preimageHash,
        claimPublicKey,
        claimAddress,
        referralId: getReferral(),
        pairHash,
    });
    */

    // See https://github.com/BoltzExchange/boltz-web-app/blob/v1.2.1/src/components/CreateButton.tsx#L120-L126
    const params = {
        type: "reversesubmarine",
        pairId: from + "/" + to,
        orderSide: "buy",
        invoiceAmount: invoiceAmount,
        expectedAmount: receiveAmount,
        preimageHash: preimageHash,
        claimPublicKey: claimPublicKey, // 'claimPublicKey' is in HEX.
        clientAddress: claimAddress,
        pairHash: provider.pk
    };

    const response = await fetcher<WexCreateReverseSwapResponse>("/createswap", params);

    let result: ReverseCreatedResponse;

    if (response.success) {
        result = response.data as ReverseCreatedResponse;
    } else {
        throw new Error(response.error);
    }

    console.log("[swapCreator.createReverseSwap] $=%o", result);
    return result;
}

export const createChainSwap = (
    from: string,
    to: string,
    userLockAmount: number | undefined,
    preimageHash: string,
    claimPublicKey: string | undefined,
    refundPublicKey: string | undefined,
    claimAddress: string | undefined,
    pairHash: string,
): Promise<ChainSwapCreatedResponse> =>
    fetcher("/v2/swap/chain", {
        from,
        to,
        preimageHash,
        claimPublicKey,
        refundPublicKey,
        claimAddress,
        pairHash,
        referralId: getReferral(),
        userLockAmount,
    });

export const getPartialRefundSignature = async (
    id: string,
    type: SwapType,
    pubNonce: Uint8Array,
    transaction: TransactionInterface,
    index: number,
): Promise<PartialSignature> => {
    checkCooperative();
    const res = await fetcher<{ pubNonce: string; partialSignature: string }>(
        `/v2/swap/${
            type === SwapType.Submarine ? "submarine" : "chain"
        }/${id}/refund`,
        {
            index,
            pubNonce: hex.encode(pubNonce),
            transaction: txToHex(transaction),
        },
    );
    return {
        pubNonce: hex.decode(res.pubNonce),
        signature: hex.decode(res.partialSignature),
    };
};

export const getPartialReverseClaimSignature = async (
    id: string,
    preimage: Uint8Array,
    pubNonce: Uint8Array,
    transaction: TransactionInterface,
    index: number,
): Promise<PartialSignature> => {
    checkCooperative();
    const res = await fetcher<{ pubNonce: string; partialSignature: string }>(
        `/v2/swap/reverse/${id}/claim`,
        {
            index,
            preimage: hex.encode(preimage),
            pubNonce: hex.encode(pubNonce),
            transaction: txToHex(transaction),
        },
    );
    return {
        pubNonce: hex.decode(res.pubNonce),
        signature: hex.decode(res.partialSignature),
    };
};

export const getSubmarineClaimDetails = async (id: string) => {
    const res = await fetcher<{
        pubNonce: string;
        preimage: string;
        transactionHash: string;
    }>(`/v2/swap/submarine/${id}/claim`);
    return {
        pubNonce: hex.decode(res.pubNonce),
        preimage: hex.decode(res.preimage),
        transactionHash: hex.decode(res.transactionHash),
    };
};

export const postSubmarineClaimDetails = (
    id: string,
    pubNonce: Uint8Array,
    partialSignature: Uint8Array,
) => {
    checkCooperative();
    return fetcher(`/v2/swap/submarine/${id}/claim`, {
        pubNonce: hex.encode(pubNonce),
        partialSignature: hex.encode(partialSignature),
    });
};

export const getEipRefundSignature = (id: string, type: SwapType) => {
    checkCooperative();
    return fetcher<{ signature: string }>(`/v2/swap/${type}/${id}/refund`);
};

export const getFeeEstimations = () =>
    fetcher<Record<string, number>>("/v2/chain/fees");

export const getNodeStats = () =>
    fetcher<{
        BTC: {
            total: {
                capacity: number;
                channels: number;
                peers: number;
                oldestChannel: number;
            };
        };
    }>("/v2/nodes/stats");

export const getContracts = () =>
    fetcher<Record<string, Contracts>>("/v2/chain/contracts");

export const broadcastTransaction = async (
    asset: string,
    txHex: string,
): Promise<{
    id: string;
}> => {
    const promises: Promise<{
        id: string;
    }>[] = [
        // See https://github.com/BoltzExchange/boltz-web-app/blob/v1.2.1/src/helper.js#L236
        fetcher<{ id: string }>(`/broadcasttransaction`, { currency: asset, transactionHex: txHex, }),
        broadcastToExplorer(asset, txHex),
    ];

    const results = await Promise.allSettled(promises);
    const successfulResult = results.find(
        (result) => result.status === "fulfilled",
    );
    if (successfulResult) {
        return (successfulResult as PromiseFulfilledResult<{ id: string }>)
            .value;
    }

    throw (results[0] as PromiseRejectedResult).reason;
};

export const getLockupTransaction = async (
    id: string,
    type: SwapType,
): Promise<LockupTransaction> => {
    switch (type) {
        case SwapType.Submarine:
            return fetcher<{
                id: string;
                hex: string;
                timeoutBlockHeight: number;
                timeoutEta?: number;
            }>(`/v2/swap/submarine/${id}/transaction`);

        case SwapType.Chain: {
            const res = await getChainSwapTransactions(id);
            return {
                id: res.userLock.transaction.id,
                hex: res.userLock.transaction.hex,
                timeoutEta: res.userLock.timeout.eta,
                timeoutBlockHeight: res.userLock.timeout.blockHeight,
            };
        }

        default:
            throw `cannot get lockup transaction for swap type ${type}`;
    }
};

export const getReverseTransaction = (id: string) =>
    fetcher<{
        id: string;
        hex: string;
        timeoutBlockHeight: number;
    }>(
        "/getswaptransaction", // Originally: `/v2/swap/reverse/${id}/transaction`,
        { id: id }
    );

export const getSwapStatus = (id: string) =>
    fetcher<SwapStatus>(`/v2/swap/${id}`);

export const getChainSwapClaimDetails = (id: string) =>
    fetcher<{
        pubNonce: string;
        publicKey: string;
        transactionHash: string;
    }>(`/v2/swap/chain/${id}/claim`);

export const postChainSwapDetails = (
    id: string,
    preimage: string | undefined,
    signature: { pubNonce: string; partialSignature: string },
    toSign?: { pubNonce: string; transaction: string; index: number },
) => {
    checkCooperative();
    return fetcher<{
        pubNonce: string;
        partialSignature: string;
    }>(`/v2/swap/chain/${id}/claim`, {
        preimage,
        signature,
        toSign,
    });
};

export const getChainSwapTransactions = (id: string) =>
    fetcher<{
        userLock: ChainSwapTransaction;
        serverLock: ChainSwapTransaction;
    }>(`/v2/swap/chain/${id}/transactions`);

export const getChainSwapNewQuote = (id: string) =>
    fetcher<{ amount: number }>(`/v2/swap/chain/${id}/quote`);

export const acceptChainSwapNewQuote = (id: string, amount: number) =>
    fetcher<object>(`/v2/swap/chain/${id}/quote`, { amount });

export const getSubmarinePreimage = (id: string) =>
    fetcher<{ preimage: string }>(`/v2/swap/submarine/${id}/preimage`);

export const getRestorableSwaps = (
    xpub: string,
    pagination?: { startIndex: number; limit: number },
) =>
    fetcher<RestorableSwap[]>(
        `/v2/swap/restore`,
        { xpub, pagination },
        null,
        30_000,
    );

export const assetRescueSetup = (
    asset: string,
    swapId: string,
    transactionId: string,
    vout: number,
    destination: string,
) =>
    fetcher<{
        musig: {
            serverPublicKey: string;
            pubNonce: string;
            message: string;
        };
        transaction: string;
    }>(`/v2/asset/${asset}/rescue/setup`, {
        swapId,
        transactionId,
        vout,
        destination,
    });

export const assetRescueBroadcast = (
    asset: string,
    swapId: string,
    pubNonce: Uint8Array,
    partialSignature: Uint8Array,
) =>
    fetcher<{
        transactionId: string;
    }>(`/v2/asset/${asset}/rescue/broadcast`, {
        swapId,
        pubNonce: hex.encode(pubNonce),
        partialSignature: hex.encode(partialSignature),
    });

export {
    Pairs,
    Contracts,
    PartialSignature,
    ChainPairTypeTaproot,
    ReversePairTypeTaproot,
    SubmarineCreatedResponse,
    SubmarinePairTypeTaproot,
    ReverseCreatedResponse,
    ChainSwapDetails,
    ChainSwapCreatedResponse,
};
