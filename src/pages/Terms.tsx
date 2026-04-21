import type { Component } from "solid-js";

import "../style/legal.scss";

const Terms: Component = () => {
    return (
        <div class="terms-container">
            <h1>Terms of Service</h1>
            <h2>1. Introduction</h2>
            <p>
                Welcome to Whale's Exchange website. These Terms of Service ("Terms") govern your use of our website, https://whales.exchange/ (the "Site"). By accessing or using
                the Site, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the Site.
            </p>

            <h2>2. Description of Service</h2>
            <p>
                The Service allows users to swap between different Bitcoin layers. Whale's Exchange combines <a href="https://boltz.exchange/">Boltz Exchange</a> frontend with
                Electrum Swap protocol. Boltz Exchange pioneered the concept of atomic swaps on Bitcoin with simple to use interface. Electrum Swap protocol decentralized atomic
                swaps on Bitcoin using <a href="https://electrum.org/">Electrum wallet</a>. Whale's Exchange web interface is based on Boltz Exchange and connects to Electrum Swap servers to
                facilitate swaps between different Bitcoin layers.
            </p>
            <p>
                Whale's Exchange serves as an interface to Electrum Swap world via web browser, without the need to run Electrum wallet. The swaps themselves are operated by
                Electrum Swap servers, which are independent entities that run the swap protocol (see <a href="https://electrum.readthedocs.io/en/latest/swapserver.html">How to
                offer Submarine Swaps</a> for more information on how to set up a swap server).
            </p>
            <p>
                Whale's Exchange use advanced cryptography and are non-custodial, which means users retain full control of their bitcoin throughout the entire flow of a swap (with
                the exception of a small reverse swap fee invoice). Users need to provide the following information to use the Service:
            </p>
            <p>
                2.1. Select the swap provider from the list of swap providers that is available on the website. The list of swap providers is obtained from 
                <a href="https://nostr.com/">Nostr</a>, where all Electrum Swap providers publish their offers.
            </p>
            <p>
                2.2. Select the Bitcoin layer that you want to swap from and the Bitcoin layer that you want to swap to.
            </p>
            <p>2.3. Select the amount of bitcoin to be swapped.</p>
            <p>
                2.4. Provide the destination information where the swapped amount will be sent.
            </p>

            <h2>3. User Conduct and Service Rules</h2>
            <p>
                3.1. You agree to use the Service only for lawful purposes. You agree not to take any action that might compromise the security of the website, render the website
                inaccessible to others, or otherwise cause damage to the website or the content. You agree not to add to, subtract from, or otherwise modify the content, or to
                attempt to access any content that is not intended for you.
            </p>
            <p>
                3.2. You use our Service at your sole option, discretion and risk.
            </p>
            <p>
                3.3. You understand that the swap providers are third party entities and who may not follow the Electrum Swap protocol. This may result in funds being locked and
                in case of reverse swap fee invoice, it may result in the loss of funds. We have no control over the swap providers and are not responsible for their actions or
                inactions. We cannot guarantee that the swap providers will fulfill their obligations.
            </p>
            <p>
                3.4. For forward swaps, sending more than one transaction to a swap address is a violation of these Terms and may result in the loss of funds. Moreover, sending
                a transaction to a swap address after the expiration of the swap is a violation of these Terms and may result in the loss of funds.
            </p>
            <p>
                3.5. For all swaps, in order to complete the swap, your browser must be kept open until the swap completes.
            </p>
            <p>
                3.6. Sending wrong amount of funds is a violation of these Terms and may result in the loss of funds.
            </p>
            <p>
                3.7. Sending wrong currency to the address specified in the swap is a violation of these Terms and may result in the loss of funds.
            </p>
            <p>
                3.8. Electrum Swaps, and therefore swaps on Whale's Exchange are executed fully automatically and when you contact support with a request to cancel or change
                a swap, Whale's Exchange reserves the right to refuse this request without giving reasons.
            </p>
            <p>
                3.9. You agree that Whale's Exchange cannot distinguish between swaps created via official software distributed by Whale's Exchange or modified swap client
                software, due to the openness of its API and open source nature of its software. You agree that Whale's Exchange can only provide support for swap client software
                officially distributed by Whale's Exchange and used in ways permitted under these Terms.
            </p>
            <p>
                3.10. You agree that there are risks associated with Internet-based systems, such as the failure of hardware, software, and Internet connections and with
                the different Bitcoin protocols, such as any malfunction, unintended function, unexpected functioning of or attack on the Bitcoin layer's protocol.
            </p>
            <p>
                3.11. Whale's Exchange explicitly disclaims any responsibility or liability for any losses, damages, or harm incurred by users as a result of scams, frauds, or any
                other deceptive practices perpetrated by third parties in connection with the use of our Service.
            </p>
            <p>
                3.12. Whale's Exchange does not provide custodial services, meaning that Whale's Exchange never controls bitcoin of users, not even for a short transient period of
                time. Users hereby indemnify Whale's Exchange, who are held to have no responsibility, against any direct, indirect, consequential, or any damages of any kind,
                arising out of or in any way connected with the use of our Service, including but not limited to those arising from users' personal error and/or misbehavior. This
                especially includes loss of funds due to loss of private keys for swap claims and refunds or providing incorrect swap destination info, e.g. an incorrect Bitcoin
                address.
            </p>
            <p>
                3.13. You agree that at no point Whale's Exchange is a sender or a recipient of any funds being swapped. All funds being swapped are sent directly from the user to
                the swap provider or from the swap provider to the user. This is the nature of the decentralized Electrum Swap protocol.
            </p>
            <p>
                3.14. Whale's Exchange collects information about the swaps for the purpose of improving the service and ability to evaluate quality of swap providers.
            </p>

            <h2>4. Modifications to Service</h2>
            <p>
                Whale's Exchange reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that
                we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
            </p>

            <h2>5. Governing Law</h2>
            <p>
                Whale's Exchange reserves the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. You agree that
                we shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
            </p>

            <h2>6. Contact Info</h2>
            <p>
                To contact us, please use <a href="https://whalessecret.com/contact-us">the contact form on the Whale's Secret website</a>.
            </p>

            <p class="last-updated">
                <strong>Last updated: May 1, 2026</strong>
            </p>
        </div>
    );
};

export default Terms;
