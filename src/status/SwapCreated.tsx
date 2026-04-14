import { sha256 } from "@noble/hashes/sha2.js";
import { hex } from "@scure/base";
import { Show, createResource } from "solid-js";

import LockupEvm from "../components/LockupEvm";
import PayInvoice from "../components/PayInvoice";
import PayOnchain from "../components/PayOnchain";
import { RBTC } from "../consts/Assets";
import { SwapType } from "../consts/Enums";
import { usePayContext } from "../context/Pay";
import type { ChainSwap, ReverseSwap } from "../utils/swapCreator";
import { useGlobalContext } from "../context/Global";

import { decodeInvoice } from "../utils/invoice";

const SwapCreated = () => {
    const { swap } = usePayContext();

    const chain = swap() as ChainSwap;
    const reverse = swap() as ReverseSwap;

    const feeInvoice = () => {
        const s = swap();
        return s.type === SwapType.Reverse ? (s as ReverseSwap).feeInvoice : undefined;
    };

    const [feeInvoiceData] = createResource(
        feeInvoice,
        async (invoice) => {
            if (!invoice) return undefined;
            return await decodeInvoice(invoice);
        }
    );

    const { t } = useGlobalContext();

    return (
        <Show
            when={swap().type === SwapType.Chain}
            fallback={
                <Show when={feeInvoiceData.state === "ready" && feeInvoiceData()}>
                    {(data) => (
                        <div>
                            <div>
                                <p class="text-sm text-gray-500">
                                    {t("pay_invoice_intro")}
                                </p>
                            </div>
                            <hr style="margin-bottom: 50px;" />

                            <PayInvoice
                                title="pay_fee_invoice_to"
                                description="pay_fee_invoice_to_description"
                                sendAmount={data().satoshis}
                                invoice={reverse.feeInvoice}
                            />

                            <div style="margin-top: 50px;" />

                            <PayInvoice
                                title="pay_invoice_to"
                                description="pay_invoice_to_description"
                                sendAmount={reverse.sendAmount}
                                invoice={reverse.invoice}
                            />
                        </div>
                    )}
                </Show>
            }>
            <Show
                when={chain.assetSend === RBTC}
                fallback={
                    <PayOnchain
                        type={chain.type}
                        assetSend={chain.assetSend}
                        assetReceive={chain.assetReceive}
                        expectedAmount={chain.lockupDetails.amount}
                        address={chain.lockupDetails.lockupAddress}
                        bip21={chain.lockupDetails.bip21}
                    />
                }>
                <LockupEvm
                    swapId={chain.id}
                    signerAddress={chain.signer}
                    amount={chain.lockupDetails.amount}
                    claimAddress={chain.lockupDetails.claimAddress}
                    timeoutBlockHeight={chain.lockupDetails.timeoutBlockHeight}
                    preimageHash={hex.encode(
                        sha256(hex.decode(chain.preimage)),
                    )}
                />
            </Show>
        </Show>
    );
};

export default SwapCreated;
