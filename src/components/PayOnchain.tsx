import { BigNumber } from "bignumber.js";
import { Show, createMemo, createResource } from "solid-js";

import CopyButton from "../components/CopyButton";
import QrCode from "../components/QrCode";
import { BTC, LBTC } from "../consts/Assets";
import { type SwapType } from "../consts/Enums";
import { useGlobalContext } from "../context/Global";
import { getPairs } from "../utils/boltzClient";
import { formatAmount, formatDenomination } from "../utils/denomination";
import { getPair, isMobile } from "../utils/helper";
import CopyBox from "./CopyBox";
import LoadingSpinner from "./LoadingSpinner";
import OptimizedRoute from "./OptimizedRoute";

const PayOnchain = (props: {
    type: SwapType;
    assetSend: string;
    assetReceive: string;
    expectedAmount: number;
    address: string;
    bip21: string;
}) => {
    const { t, denomination, separator, setPairs, pairs } = useGlobalContext();

    const [pairsFetch] = createResource(async () => {
        if (pairs() !== undefined) {
            return pairs();
        }

        const p = await getPairs();
        setPairs(p);
        return p;
    });

    return (
        <div>
            <div>
                <p class="text-sm text-gray-500">
                    {t("wex_forward_warning")}
                </p>
            </div>

            <OptimizedRoute />
            <hr />
            <a href={props.bip21}>
                <QrCode asset={props.assetSend} data={props.bip21} />
            </a>
            <hr />
            {/* Use 4 chars to display Liquid addresses, 5 for other assets */}
            <CopyBox
                value={props.address}
                groupSize={props.assetSend === LBTC ? 4 : 5}
            />
            <Show when={props.assetSend === BTC}>
                <hr class="spacer" />
                <h3>{t("warning_expiry")}</h3>
            </Show>
            <Show when={isMobile()}>
                <hr />
                <a href={props.bip21} class="btn btn-light">
                    {t("open_in_wallet")}
                </a>
            </Show>
            <hr />
            <div class="btns" data-testid="pay-onchain-buttons">
                <Show when={props.expectedAmount > 0}>
                    <CopyButton
                        label="copy_amount"
                        data={() =>
                            formatAmount(
                                BigNumber(props.expectedAmount),
                                denomination(),
                                separator(),
                            )
                        }
                    />
                </Show>

                <CopyButton label="copy_address" data={props.address} />
                <CopyButton label="copy_bip21" data={props.bip21} />
            </div>
        </div>
    );
};

export default PayOnchain;
