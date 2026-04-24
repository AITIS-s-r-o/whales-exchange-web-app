import log from "loglevel";
import { createEffect, on } from "solid-js";
import { calculateSendAmount } from "src/utils/calculate";
import { btcToSat } from "src/utils/denomination";

import { LN, RBTC, LBTC } from "../consts/Assets";
import { SwapType } from "../consts/Enums";
import { useCreateContext } from "../context/Create";
import { useGlobalContext } from "../context/Global";
import { probeUserInput } from "../utils/compat";
import { formatError } from "../utils/errors";
import {
    extractAddress,
    extractBip21Amount,
    extractInvoice,
} from "../utils/invoice";

const AddressInput = () => {
    let inputRef: HTMLInputElement;

    const { t, notify } = useGlobalContext();
    const {
        assetReceive,
        boltzFee,
        minerFee,
        swapType,
        amountValid,
        onchainAddress,
        setAddressValid,
        setAssetReceive,
        setAssetSend,
        assetSend,
        setOnchainAddress,
        setInvoice,
        sendAmount,
        setReceiveAmount,
        setSendAmount,
    } = useCreateContext();

    const handleInputChange = async (input: HTMLInputElement) => {
        console.log("[AddressInput.handleInputChange] *");

        console.log("[AddressInput.handleInputChange] Context; swapType=%s, assetReceive=%s, onchainAddress=%s", swapType(), assetReceive(), onchainAddress());

        const inputValue = input.value.trim();
        console.log("[AddressInput.handleInputChange] Input value is %s", inputValue);
        setOnchainAddress(inputValue);

        if (inputValue.length === 0) {
            setAddressValid(false);
            input.classList.remove("invalid");
            input.setCustomValidity("");

            console.log("[AddressInput.handleInputChange] $<EMPTY_INPUT_VALUE>");
            return;
        }

        const address = extractAddress(inputValue);
        const invoice = extractInvoice(inputValue);

        const bip21Amount = extractBip21Amount(inputValue);
        if (bip21Amount) {
            setReceiveAmount(btcToSat(bip21Amount));
            setSendAmount(
                calculateSendAmount(
                    btcToSat(bip21Amount),
                    boltzFee(),
                    minerFee(),
                    swapType(),
                ),
            );
        }

        try {
            const assetName = assetReceive();
            const actualAsset =
                (await probeUserInput(assetName, invoice)) ??
                (await probeUserInput(assetName, address));

            console.log("[AddressInput.handleInputChange] address=%s, invoice=%s, bip21Amount=%o", address, invoice, bip21Amount);
            console.log("[AddressInput.handleInputChange] assetName=%s, actualAsset=%s", assetName, actualAsset);

            switch (actualAsset) {
                // WEX We do not support Liquid or Rootstock.
                case LBTC:
                case RBTC:
                    throw new Error();

                case LN: {
                    /* WEX in first version we do not support forward swaps, so disable switching to forward swap if LN invoice is pasted to the input */
                    throw new Error();

                    setAssetReceive(LN);
                    if (assetSend() === LN) {
                        setAssetSend(assetName);
                    }
                    setOnchainAddress("");
                    setInvoice(invoice);
                    notify("success", t("switch_paste"));
                    break;
                }

                case null:
                    throw new Error();

                default: {
                    if (assetName !== actualAsset) {
                        setAssetSend(assetReceive());
                        setAssetReceive(actualAsset);
                        notify("success", t("switch_paste"));
                    }

                    input.setCustomValidity("");
                    input.classList.remove("invalid");
                    setAddressValid(true);
                    setOnchainAddress(address);
                    break;
                }
            }
        } catch (e) {
            setAddressValid(false);

            if (inputValue.length !== 0) {
                // log.debug(`Invalid address input: ${formatError(e)}`);
                console.log("Invalid address input; inputValue=%o, error=%o", inputValue, e);

                const msg = t("invalid_address", { asset: assetReceive() });
                input.classList.add("invalid");
                input.setCustomValidity(msg);
            }
        }

        console.log("[AddressInput.handleInputChange] $");
    };

    createEffect(
        on([amountValid, onchainAddress, assetReceive], () => {
            if (
                sendAmount().isGreaterThan(0) &&
                swapType() !== SwapType.Submarine &&
                assetReceive() !== RBTC &&
                onchainAddress() === ""
            ) {
                setAddressValid(false);
            }
        }),
    );

    return (
        <input
            ref={inputRef}
            required
            onInput={(e) => handleInputChange(e.currentTarget)}
            type="text"
            id="onchainAddress"
            data-testid="onchainAddress"
            name="onchainAddress"
            autocomplete="off"
            placeholder={t("onchain_address", { asset: assetReceive() })}
            value={onchainAddress()}
        />
    );
};

export default AddressInput;
