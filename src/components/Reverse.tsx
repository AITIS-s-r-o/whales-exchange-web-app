import { ImArrowDown } from "solid-icons/im";

import { useCreateContext } from "../context/Create";


/**
 * Props for the component.
 * 
 * This component displays the selected provider details.
 */
interface Props {
    /**
     * Translation method.
     * 
     * @param key Text key.
     * @returns Text in the currently selected language.
     */
    t: (key: string) => string;
}

const Reverse = (props: Props) => {
    /* WEX const {
        assetReceive,
        assetSend,
        setAssetSend,
        setAssetReceive,
        setOnchainAddress,
        setInvoice,
    } = useCreateContext();
    const setDirection = () => {
        setOnchainAddress("");
        setInvoice("");
        const sendOld = assetSend();
        setAssetSend(assetReceive());
        setAssetReceive(sendOld);
    };*/

    const setDirection = () => {
        alert(props.t("wex_reverse_forward_disabled"));
    };

    return (
        <button id="flip-assets" onClick={() => setDirection()}>
            <ImArrowDown size={14} />
        </button>
    );
};

export default Reverse;
