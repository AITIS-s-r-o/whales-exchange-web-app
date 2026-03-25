import type { Accessor } from "solid-js";
import type { WexElectrumSwapProvider } from "../utils/electrumClient";

interface Props {
    provider: Accessor<WexElectrumSwapProvider | null>;
}

export default function WexProvider(props: Props) {
    return (
        <div class="mt-8">
            {props.provider() ? (
                <div class="p-6 bg-white border border-gray-200 rounded-2xl">
                    <h3 class="text-lg font-semibold mb-4">Selected Provider</h3>

                    <div class="grid grid-cols-2 gap-x-8 gap-y-6 text-sm">
                        <div>
                            <div class="text-gray-500 text-xs mb-1">PUBKEY</div>
                            <div class="font-mono text-xs break-all bg-gray-50 p-3 rounded border">
                                {props.provider()!.server_pubkey}
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <div class="text-gray-500 text-xs mb-1">FEE</div>
                                <div class="text-xl font-medium">{props.provider()!.percentage_fee}%</div>
                            </div>

                            <div class="flex gap-8">
                                <div>
                                    <div class="text-gray-500 text-xs mb-1">MAX FORWARD</div>
                                    <div class="text-xl font-medium">{props.provider()!.max_forward_sat}</div>
                                </div>
                                <div>
                                    <div class="text-gray-500 text-xs mb-1">MAX REVERSE</div>
                                    <div class="text-xl font-medium">{props.provider()!.max_reverse_sat}</div>
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
