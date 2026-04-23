import { useGlobalContext } from "../context/Global";
import "../style/contact.scss";
import ExternalLink from "../components/ExternalLink";

const Contact = () => {
    const { t } = useGlobalContext();

    return (
        <div class="contact-container">
            <h1>{t("contact")}</h1>
            <p>
                For general inquiries and sensitive bug reports, you can use <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact
                form</ExternalLink> to contact us.
            </p>
            <p>
                If you found a bug, or want to contribute to this project, please create an issue or a pull request in the relevant repository:
            </p>
            <ul>
                <li><ExternalLink href="https://github.com/AITIS-s-r-o/whales-exchange-web-app">Whale's Exchange Web App</ExternalLink> (this frontend application);</li>
                <li>
                    <ExternalLink href="https://github.com/AITIS-s-r-o/whales-exchange-backend">Whale's Exchange Backend</ExternalLink> (API bridge to Electrum backend RPC in
                    .NET);
                </li>
                <li>
                    <ExternalLink href="https://github.com/AITIS-s-r-o/electrum-swap-backend">Whale's Exchange Electrum Swap Bridge</ExternalLink> (modified Electrum wallet
                    used to communicate with Electrum Swap providers)
                </li>
            </ul>
            <p>
                If you are looking for developer support, you can join <ExternalLink href="https://t.me/whales_secret_support">Whale's Secret Developer Support on Telegram
                </ExternalLink>.
            </p>
            <p>
                You can also <ExternalLink href="https://x.com/WhalesSecret">follow us on X</ExternalLink>.
            </p>
        </div>
    );
};

export default Contact;
