import type { Accessor } from "solid-js";
import type { WexSwapProvider } from "../utils/wexClient";

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
    return (
        <div class="mt-8">
            {props.provider() ? (
                <div class="p-6 bg-white border border-gray-200 rounded-2xl">
                    <h3 class="text-lg font-semibold mb-4">{props.t("wex_selected_provider")}</h3>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
                        <div>
                            <div class="text-gray-500 text-xs mb-1">PUBKEY</div>
                            <div class="font-mono text-xs break-all bg-gray-50 p-3 rounded border">
                                {props.provider()!.pk}
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <div class="text-gray-500 text-xs mb-1">FEE</div>
                                <div class="text-xl font-medium">{props.provider()!.fwdFee}%</div>
                            </div>

                            <div class="flex gap-8">
                                <div>
                                    <div class="text-gray-500 text-xs mb-1">MAX FORWARD</div>
                                    <div class="text-xl font-medium">{props.provider()!.fwdMax}</div>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-xs mb-1">MAX REVERSE</div>
                                    <div class="text-xl font-medium">{props.provider()!.revMax}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // No provider selected.
                <div class="mt-6 p-6 border border-dashed border-gray-300 rounded-xl text-center text-gray-500">
                    Select a provider from the table above
                </div>
            )}
        </div>
    );
}
