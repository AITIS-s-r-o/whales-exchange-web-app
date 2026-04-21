import { useGlobalContext } from "../context/Global";
import "../style/help.scss";

const Help = () => {
    const { t } = useGlobalContext();

    return (
        <div class="help">
            <div class="header">
                <h2>{t("help_description")}</h2>
            </div>
            <div class="content">
            TODO
            </div>
        </div>
    );
};

export default Help;
