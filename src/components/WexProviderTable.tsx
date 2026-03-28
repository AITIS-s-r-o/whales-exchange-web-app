import type { Accessor } from "solid-js";
import { For, } from "solid-js";
import type { WexSwapProvider } from "../utils/wexClient";
import "../style/wexProviderTable.scss";
import { createHash } from "crypto";

/**
 * Props for the component.
 * 
 * This component displays a scrollable table of Electrum Swap providers, allowing the user to view provider details and select one for swapping.
 */
interface Props {
    /** Reactive array of available swap providers.*/
    providers: Accessor<WexSwapProvider[]>;

    /** Reactive reference to the currently selected provider. Used to highlight the selected row in the table. */
    selected: Accessor<WexSwapProvider | null>;

    /**
     * Callback function triggered when a user clicks on a provider row.
     *
     * @param provider  The provider that was clicked.
     */
    onSelect: (provider: WexSwapProvider) => void;
}

/**
 * Computes CSS color for a provider's public key.
 * 
 * @param pubkey Public key of a provider.
 * @returns CSS string with the color derived from the pubkey.
 */
function pubkeyToRgbColor(pubkey: string): string {
    if (typeof pubkey !== "string") {
        throw new TypeError("pubkey must be a string");
    }
    if (pubkey.length !== 64) {
        throw new Error("pubkey must be 64 characters long");
    }

    // Hash the UTF‑8 bytes of the pubkey.
    const hash = createHash("sha256")
        .update(Buffer.from(pubkey, "utf8"))
        .digest();

    // Convert the full 32‑byte hash into a big integer.
    let inputHash = 0n;
    for (const byte of hash) {
        inputHash = (inputHash << 8n) | BigInt(byte);
    }

    const r = Number((inputHash & 0xFF0000n) >> 16n);
    const g = Number((inputHash & 0x00FF00n) >> 8n);
    const b = Number(inputHash & 0x0000FFn);

    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts string timestamp to human-readable "time ago".
 * 
 * @param timestamp Timestamp as a string in 'YYYY-MM-DDZHH:MM:SS' format.
 * @returns Human-readable "time ago".
 */
function getLastSeen(timestamp: string): string {
    const providerTime = Math.floor(new Date(timestamp + "Z").getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    const diff = now - providerTime;

    if (diff < 60) return "<1 min ago";
    if (diff < 3600) {
        const min = Math.floor(diff / 60);
        return min === 1 ? "1 min ago" : `${min} mins ago`;
    }
    if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        return h === 1 ? "1 hour ago" : `${h} hours ago`;
    }
    if (diff < 2592000) {
        const d = Math.floor(diff / 86400);
        return d === 1 ? "1 day ago" : `${d} days ago`;
    }
    const m = Math.floor(diff / 2592000);
    return m === 1 ? "1 month ago" : `${m} months ago`;
}

/**
 * Renders swap providers table.
 * 
 * @param props Input propereties.
 * @returns HTML with the swap provider table.
 */
export default function WexProviderTable(props: Props) {
    return (
        <div class="wex-provider-table">
            <div class="table-container">
                <div class="table-body-wrapper">
                    <table>
                        <thead>
                            <tr>
                                <th/>
                                <th>Pubkey</th>
                                <th>Fee</th>
                                <th>Max Forward</th>
                                <th>Max Reverse</th>
                                <th>Last seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={props.providers()}>
                                {(p) => {
                                    const isSelected = () => props.selected()?.pk === p.pk;
                                    const lastSeen = () => getLastSeen(p.time);
                                    const color = () => pubkeyToRgbColor(p.pk);

                                    return (
                                        <tr
                                            class={isSelected() ? "selected" : ""}
                                            onClick={() => props.onSelect(p)}>
                                            <td>
                                                <div
                                                    class="color-dot"
                                                    style={{ "background-color": color() }}
                                                />
                                            </td>
                                            <td class="pubkey">
                                                {p.pk.slice(0, 8)}…
                                            </td>
                                            <td class="text-right font-medium text-white">
                                                {p.fwdFee}%
                                            </td>
                                            <td class="text-right">
                                                {p.fwdMax.toLocaleString()}
                                            </td>
                                            <td class="text-right">
                                                {p.revMax.toLocaleString()}
                                            </td>
                                            <td class="text-right text-gray-400 whitespace-nowrap">
                                                {lastSeen()}
                                            </td>
                                        </tr>
                                    );
                                }}
                            </For>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
