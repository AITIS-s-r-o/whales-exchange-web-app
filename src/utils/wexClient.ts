import log from "loglevel";

import { fetcher } from "./helper";

/**
 * Single swap provider information from Electrum get_submarine_swap_providers call.
 */
export interface WexSwapProvider {

    /** Public key of the swap provider as a hex string. */
    pk: string;

    /** UTC time when the provider was last seen. */
    time: string;

    /** Amount of PoW the provider used for its profile. */
    pow: number;

    /** Forward swap provider fee in percent. */
    fwdFee: number;

    /** Reverse swap provider fee in percent. */
    revFee: number;

    /** Minimum amount for a forward swap in satoshis. */
    fwdMin: number;

    /** Minimum amount for a reverse swap in satoshis. */
    revMin: number;

    /** Maximum amount for a forward swap in satoshis. */
    fwdMax: number;

    /** Maximum amount for a reverse swap in satoshis. */
    revMax: number;

    /** Mining fee for forward swaps in satoshis. */
    fwdMining: number;

    /** Mining fee for reverse swaps in satoshis. */
    revMining: number;
}

/**
 * Base response wrapper for all REST API calls.
 * Follows the success/data/error pattern from the backend.
 */
export interface WexRestResponseBase {
    /**
     * `true` if the API call succeeded, `false` otherwise.
     */
    success: boolean;

    /**
     * If `success` is `true`, this contains the result of the API call;
     * otherwise this is `null`.
     */
    data: unknown;

    /**
     * If `success` is `false`, this is the error message;
     * otherwise this is `null`.
     */
    error: string | null;
}

/**
 * Response to GetSwapProvidersAsync call.
 */
export interface WexGetSwapProvidersResponse extends WexRestResponseBase {
    /**
     * Ordered list of swap providers.
     * Providers are ordered first by PoW (descending) and then by public key (ascending).
     */
    data: WexSwapProvider[] | null;
}

/**
 * Gets sorted list of swap providers from the API server.
 * 
 * @returns Returns a list swap providers, sorted by PoW (descending) and then by pubkey (ascending). If the method fails, empty array is returned.
 */
export const wexGetSubmarineSwapProviders = async (): Promise<WexSwapProvider[]> => {
    try {
        const response = await fetcher<WexGetSwapProvidersResponse>("/get-swap-providers", null);

        if (!response?.success) {
            return [];
        }

        const utcTimeSec: number = Math.floor(Date.now() / 1000); 
        const result = response.data;

        // Log debug data.
        result.forEach((provider, index) => {
            const providerTime = Math.floor(new Date(provider.time + "Z").getTime() / 1000);
            const timeDiff = utcTimeSec - providerTime;
            log.debug(
                `[${index + 1}] ${provider.pk} | ` +
                `PoW: ${provider.pow} | ` +
                `Min: ${provider.fwdMin} sat | ` +
                `Max Forward: ${provider.fwdMax} sat | ` +
                `Max Reverse: ${provider.revMax} sat | ` +
                `Fee: ${(provider.fwdFee).toFixed(2)}% | ` +
                `Timestamp: ${provider.time} (diff ${timeDiff})`
            );
        });

        return result;
    } catch (error) {
        log.error("Failed to fetch submarine swap providers.", error);
        throw error;
    }
};
