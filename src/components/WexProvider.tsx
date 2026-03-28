import type { Accessor } from "solid-js";
import type { WexSwapProvider } from "../utils/wexClient";
import { createMemo } from "solid-js";
import { pubkeyToRgbColor } from "../components/WexProviderTable";   // reuse the color function from your table
import "../style/wexProvider.scss";

/**
 * Props for the component.
 * 
 * This component displays the selected provider details.
 */
interface Props {
    /**
     * Selected provider to display.
     */
    provider: Accessor<WexSwapProvider | null>;

    /**
     * Translation method.
     * 
     * @param key Text key.
     * @returns Text in the currently selected language.
     */
    t: (key: string) => string;
}

/**
 * Renders the selected provider details.
 * 
 * @param props Input propereties.
 * @returns HTML with the selected provider details.
 */
export default function WexProvider(props: Props) {
    // Create memoized values so they react properly
    const currentProvider = createMemo(() => props.provider());

    const color = createMemo(() => {
        const p = currentProvider();
        return p ? pubkeyToRgbColor(p.pk) : "#64748b";
    });

    const pubkey = createMemo(() => currentProvider()?.pk || "");
    const fee = createMemo(() => currentProvider()?.fwdFee || 0);
    const fwdMax = createMemo(() => currentProvider()?.fwdMax || 0);
    const revMax = createMemo(() => currentProvider()?.revMax || 0);

    return (
        <div class="wex-selected-provider">
            <h3 class="title">{props.t("wex_selected_provider")}</h3>

            <div class="card">
                {currentProvider() ? (
                    <>
                        {/* Public Key Section */}
                        <div class="pubkey-section">
                            <div class="pubkey-row">
                                <div
                                    class="color-dot"
                                    style={{ "background-color": color() }}
                                />
                                <div class="pubkey-text">
                                    {pubkey()}
                                </div>
                            </div>
                        </div>

                        {/* Limits Table */}
                        <div class="limits-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{props.t("wex_provider_fee")}</th>
                                        <th>{props.t("wex_provider_limit_forward")}<br />{props.t("wex_provider_limit_forward_sub")}</th>
                                        <th>{props.t("wex_provider_limit_reverse")}<br />{props.t("wex_provider_limit_reverse_sub")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="value">{fee()}%</td>
                                        <td class="value">{fwdMax().toLocaleString()}</td>
                                        <td class="value">{revMax().toLocaleString()}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </>
                ) : (
                    <div class="no-provider">{props.t("wex_provider_none")}</div>
                )}
            </div>
        </div>
    );
}
