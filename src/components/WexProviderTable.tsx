import type { Accessor } from "solid-js";
import { For } from "solid-js";
import type { WexElectrumSwapProvider } from "../utils/electrumClient"; // adjust path if needed

interface Props {
    providers: Accessor<WexElectrumSwapProvider[]>;
    selected: Accessor<WexElectrumSwapProvider | null>;
    onSelect: (provider: WexElectrumSwapProvider) => void;
}

/**
 * Converts provider pubkey into a CSS color.
 * 
 * @param pubkey Provider's pubkey.
 * @returns String with CSS color.
 */
function pubkeyToColor(pubkey: string): string {
    if (typeof pubkey !== "string" || pubkey.length !== 64) {
        return "#64748b";
    }

    let hash = 0;
    for (let i = 0; i < 64; i++) {
        hash = (hash << 5) - hash + pubkey.charCodeAt(i);
        hash = hash & hash;
    }

    const r = (hash >> 16) & 0xff;
    const g = (hash >> 8) & 0xff;
    const b = hash & 0xff;

    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Converts a UNIX timestamp into a human-readable string describing how old the timestamp is.
 * 
 * @param timestamp UNIX timestamp to convert.
 * @returns Human-readable string describing how old the timestamp is.
 */
function getLastSeen(timestamp: number): string {
    const now = Math.floor(Date.now() / 1000);
    const diff = now - timestamp;

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

export default function WexProviderTable(props: Props) {
    return (
        <div class="wex-provider-table">
            <div class="max-h-[300px] overflow-auto border border-gray-300 rounded-lg bg-white">
                <table class="w-full text-sm">
                    <thead class="sticky top-0 bg-white border-b border-gray-300 z-10">
                        <tr class="text-left text-gray-600">
                            <th class="px-4 py-3 font-medium w-12"/>
                            <th class="px-4 py-3 font-medium">Pubkey</th>
                            <th class="px-4 py-3 font-medium text-right">Fee</th>
                            <th class="px-4 py-3 font-medium text-right">Max Forward</th>
                            <th class="px-4 py-3 font-medium text-right">Max Reverse</th>
                            <th class="px-4 py-3 font-medium text-right">Last seen</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <For each={props.providers()}>
                            {(p) => {
                                const isSelected = () => props.selected()?.server_pubkey === p.server_pubkey;
                                const lastSeen = () => getLastSeen(p.timestamp);

                                return (
                                    <tr
                                        class={`cursor-pointer hover:bg-blue-50 transition-colors ${isSelected() ? "bg-blue-100" : ""}`}
                                        onClick={() => props.onSelect(p)}>
                                        <td class="px-4 py-3">
                                            <div
                                                class="w-4 h-6 rounded"
                                                style={{ "background-color": pubkeyToColor(p.server_pubkey) }}
                                            />
                                        </td>
                                        <td class="px-4 py-3 font-mono text-xs break-all">
                                            {p.server_pubkey.slice(0, 8)}…
                                        </td>
                                        <td class="px-4 py-3 text-right font-medium">{p.percentage_fee}%</td>
                                        <td class="px-4 py-3 text-right">{p.max_forward_sat}</td>
                                        <td class="px-4 py-3 text-right">{p.max_reverse_sat}</td>
                                        <td class="px-4 py-3 text-right text-gray-500">{lastSeen()}</td>
                                    </tr>
                                );
                            }}
                        </For>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
