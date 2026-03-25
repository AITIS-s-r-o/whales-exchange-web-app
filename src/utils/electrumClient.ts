// src/utils/electrumClient.ts
import log from "loglevel";

import { wexElectrumFetcher } from "./helper";

/**
 * Single swap provider information from Electrum get_submarine_swap_providers call.
 */
export interface WexElectrumSwapProvider {
    percentage_fee: number;
    max_forward_sat: number;
    max_reverse_sat: number;
    min_amount_sat: number;
    prepayment: number;
    mining_fee: number;
    timestamp: number;
    server_pubkey: string;
    pow_bits: number;
    server_npub: string;
}

/**
 * Type definitions matching the Electrum output of get_submarine_swap_providers.
 */
interface WexElectrumSwapProvidersResponse {
    [server_npub: string]: WexElectrumSwapProvider;
}

/**
 * Calls Electrum's get_submarine_swap_providers RPC method.
 * 
 * @param query_time Optionally, how long to wait for Nostr replies in seconds.
 * @returns Returns a map of npub → provider details exactly as Electrum outputs it.
 */
const wexGetSubmarineSwapProviders = async (
    query_time: number = 15
): Promise<WexElectrumSwapProvidersResponse> => {
    try {
        const result = await wexElectrumFetcher<WexElectrumSwapProvidersResponse>(
            "get_submarine_swap_providers",
            /* TODO how to encode? it should go as `"params":[]` if null is provided or as "params":{"query_time":15} for value 15
            [query_time]*/
            null
        );

        log.debug("Electrum swap providers loaded.", {
            count: Object.keys(result).length,
        });

        return result;
    } catch (error) {
        log.error("Failed to fetch submarine swap providers from Electrum.", error);
        throw error;
    }
};

/**
 * Gets sorted list of swap providers from Electrum.
 * 
 * @returns Returns a list provider details, sorted by PoW (descending) and then by pubkey (ascending).
 */
export const wexLoadSwapProviders = async (): Promise<WexElectrumSwapProvider[]> => {
    const providersMap = await wexGetSubmarineSwapProviders(15);

    // Convert to array and sort.
    const sortedProviders = Object.entries(providersMap)
        .map(([server_npub, provider]) => ({
            ...provider,
            server_npub,
        }))
        .sort((a, b) => {
            // Primary sort: pow_bits DESC (strongest first).
            if (a.pow_bits !== b.pow_bits) {
                return b.pow_bits - a.pow_bits;
            }

            // Secondary sort: server_pubkey ASC.
            return a.server_pubkey.localeCompare(b.server_pubkey);
        });

    if (sortedProviders.length > 0) {
        const utcTimeSec: number = Math.floor(Date.now() / 1000);
        log.debug(`Loaded and sorted ${sortedProviders.length} swap providers (current time ${utcTimeSec}):`);
 
        sortedProviders.forEach((provider, index) => {
            log.debug(
                `[${index + 1}] ${provider.server_pubkey} | ` +
                `PoW: ${provider.pow_bits} | ` +
                `Min: ${provider.min_amount_sat} sat | ` +
                `Max Forward: ${provider.max_forward_sat} sat | ` +
                `Fee: ${(provider.percentage_fee).toFixed(2)}% | ` +
                `Timestamp: ${provider.timestamp} (diff ${utcTimeSec - provider.timestamp})`
            );
        });
    } else {
        log.debug("No swap providers received from Electrum.");
    }

    return sortedProviders;
};
