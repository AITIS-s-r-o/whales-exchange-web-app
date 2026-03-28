import type { Accessor } from "solid-js";
import { For } from "solid-js";
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

    /**
     * Translation method.
     * 
     * @param key Text key.
     * @returns Text in the currently selected language.
     */
    t: (key: string) => string;
}

/**
 * Computes CSS color for a provider's public key.
 * 
 * @param pubkey Public key of a provider.
 * @returns CSS string with the color derived from the pubkey.
 */
export function pubkeyToRgbColor(pubkey: string): string {
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
function getLastSeen(timestamp: string, t: (key: string) => string): string {
    const providerTime = Math.floor(new Date(timestamp + "Z").getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);
    const diff = now - providerTime;

    if (diff < 60) return `<1 ${t("wex_provider_table_seen_min_ago")}`;
    if (diff < 3600) {
        const min = Math.floor(diff / 60);
        return min === 1 ? `1 ${t("wex_provider_table_seen_min_ago")}` : `${min} ${t("wex_provider_table_seen_min_ago")}`;
    }
    if (diff < 86400) {
        const h = Math.floor(diff / 3600);
        return h === 1 ? `1 ${t("wex_provider_table_seen_hour_ago")}` : `${h} ${t("wex_provider_table_seen_hours_ago")}`;
    }
    if (diff < 2592000) {
        const d = Math.floor(diff / 86400);
        return d === 1 ? `1 ${t("wex_provider_table_seen_day_ago")}` : `${d} ${t("wex_provider_table_seen_days_ago")}`;
    }
    const m = Math.floor(diff / 2592000);
    return m === 1 ? `1 ${t("wex_provider_table_seen_month_ago")}` : `${m} ${t("wex_provider_table_seen_months_ago")}`;
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
                                <th>{props.t("wex_provider_table_pubkey")}</th>
                                <th>{props.t("wex_provider_table_fee")}</th>
                                <th>{props.t("wex_provider_table_max_forward")}</th>
                                <th>{props.t("wex_provider_table_max_reverse")}</th>
                                <th>{props.t("wex_provider_table_last_seen")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <For each={props.providers()}>
                                {(p) => {
                                    const isSelected = () => props.selected()?.pk === p.pk;
                                    const lastSeen = () => getLastSeen(p.time, props.t);
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
