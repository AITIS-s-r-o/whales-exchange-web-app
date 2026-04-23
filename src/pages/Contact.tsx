import { useGlobalContext } from "../context/Global";
import "../style/contact.scss";

const Contact = () => {
    const { t } = useGlobalContext();

    return (
        <div class="contact">
            <div class="header">
                <h2>{t("contact_description")}</h2>
            </div>
            <div class="content">
            TODO
            </div>
        </div>
    );
};

export default Contact;
