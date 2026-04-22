import type { Component } from "solid-js";

import ExternalLink from "../components/ExternalLink";
import { config } from "../configs/mainnet";
import "../style/legal.scss";

const Privacy: Component = () => {
    return (
        <div class="privacy-container">
            <h1>Privacy Policy</h1>

            <p>
                AITIS s.r.o. ("we," "us," or "our") operates {`${config.whalesExchangeUrl}`} (the "Site"), which is an interface to enable access to the Electrum Swap protocol
                without using Electrum wallet (the "Service"). This privacy policy sets out how the Site uses and protects any information that you give to the Site or that
                the Site collects about you when you use this website. If you require any more information or have any questions about our privacy policy, please feel free
                to use <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact form</ExternalLink>.
            </p>
            <h2>1. Scope of Policy</h2>
            <p>
                This policy together with the <a href="/terms">Terms of Service</a> apply to your use of:
            </p>
            <ul>
                <li>our website at {`${config.whalesExchangeUrl}`} including, without limitation,</li>
                <li>any of its services accessible through the Site (the "Services").</li>
            </ul>
            <p>
                This policy sets out the basis on which any personal data we collect from you, or that you provide to us, will be processed and used by us:
            </p>
            <ul>
                <li>
                    As the data controller responsible for your personal data that you provide us in the process of our registration process and/or when you have been going
                    through our websites.
                </li>
                <li>As the Data Processor that processes data by Services used by you – user of these Services.</li>
            </ul>
            <p>
                So that we're clear and there's no misunderstanding about how we handle your personal data, we will:
            </p>
            <ul>
                <li>Never sell your data.</li>
                <li>Always keep your data safe and private.</li>
            </ul>
            <p>
                If you have any questions about this privacy notice, including any requests to exercise your legal rights, please contact us via 
                <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact form</ExternalLink>.
            </p>

            <h3>Complaints</h3>
            <p>
                You have the right to make a complaint at any time to the Czech Data Protection Authority (CDPA) for data protection issues (
                <ExternalLink href="https://www.uoou.cz/en">https://www.uoou.cz/en</ExternalLink>). We would, however, appreciate the chance to deal with your concerns before you
                approach the CDPA so please contact us in the first instance via <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact
                form</ExternalLink>.
            </p>

            <h2>2. Cookies and Local Storage</h2>
            <p>
                This Site does not use cookies. Instead, this site uses web browser Local Storage to store information that is important for the user's security and operation of
                the Service. This Site does not use any tracking, marketing, or analytics cookies, nor does the Site use Local Storage for these purposes.
            </p>

            <h2>3. Information Collection and Use</h2>
            <p>We will collect and process the following data about you:</p>
            <p>
                a) Information you give us "Submitted Information": This is information you give us about you by browsing our Site, filling in forms on the Site, or by
                corresponding with us (for example, by e-mail). It includes information you provide when you use Services or and when you report a problem with the Services,
                or the Site. If you contact us, we will keep a record of that correspondence. The information you give us may include your name, e-mail address, and any other
                information you provide to us.
            </p>
            <p>
                b) Information we collect about you and your device. Each time you visit our Site we will automatically collect the following information:
            </p>
            <ul>
                <li>
                    technical information, including the internet protocol (IP) address used to connect your computer to the Internet, device information, the type of browser you
                    use;
                </li>
                <li>information about your visit, including the full uniform resource locators (URL) within our Site (including date and time);</li>
                <li>pages you viewed, page response times, download errors, length of visits to certain pages.</li>
            </ul>
            <p>
                c) Information to help us deliver our Service to you and to help you perform the atomic swaps with the swap providers. We send the requests to create swap on your
                behalf to the swap providers you select. Swap providers are third parties with who you collaborate to perform bitcoin swaps. Information we may collect about you
                is related to swaps you perform. This includes:
            </p>
            <ul>
                <li>
                    Collecting and storing information about the swap itself, such as the amount swapped, the type of swap, and the status of the swap, sw transaction destinations
                    such as Bitcoin addresses or Lightning invoices.
                </li>
                <li>
                    Collecting and storing data related to transaction origins, including transaction identifiers or Lightning invoices.
                </li>
                <li>
                    Collecting IP Address. We do not permanently store your IP address but may temporarily process it and log it for the purpose of the Service abuse prevention.
                </li>
            </ul>
            <p>
                d) Information about the requested swaps and information required for the recovery of funds in case of protocol violation or errors, is stored in the Local Storage
                of your web browser.
            </p>

            <h2>4. Information Third Parties May Collect</h2>
            <p>
                We only share your data with third parties that are necessary to provide the Service to you. This means we do send your swap requests to the swap providers you
                select, so that they can perform the swap with you. The swap providers may collect and store any information about your swaps, such as source and destination
                addresses, Lightning invoices, swap amounts, and swap types. We do not control the data collection and storage practices of the swap providers.
            </p>

            <h2>5. Uses Made of the Information</h2>
            <p>
                Below is a summary of the key types of data that we make use of as part of the Services. For more information on how these types of data are used and for which
                purposes then please see the table below.
            </p>
            <p>We use information held about you in the following ways:</p>
            <p>a) Submitted Information: We will use this information:</p>
            <ul>
                <li>to carry out our obligations arising from any transactions you enter into with us (delivery of our Services).</li>
            </ul>
            <p>b) Location Information: We will use this information:</p>
            <ul>
                <li>to comply with our regulatory obligations;</li>
                <li>to protect against fraud and abuse of our services.</li>
            </ul>

            <h2>6. Purposes for which We Will Use Your Personal Data</h2>
            <p>
                We have set out below, in a table format, a description of all the ways we use your personal data as stated above, and which of the legal bases we rely on to
                do so. We have also identified what our legitimate interests are where appropriate.
            </p>
            <p>
                Note that we may process your personal data for more than one lawful ground depending on the specific purpose for which we are using your data. Please contact
                us via <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact form</ExternalLink> if you need details about the specific legal ground we
                are relying on to process your personal data where more than one ground has been set out in the table below.
            </p>

            <table id="wex-privacy-table">
                <tbody>
                    <tr>
                        <td><b>What we use your information for</b></td>
                        <td><b>Type of Information</b></td>
                        <td><b>Our reasons</b></td><td><b>Our legitimate interests</b></td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                <b>To provide the Services:</b>
                            </p>
                            <p>
                                To carry out our obligations arising from any transactions you enter into with us and to provide you with the information, products and services
                                that you request from us.
                            </p>
                        </td>
                        <td>
                            <p>Submitted Information</p>
                            <p>Device Information</p>
                        </td>
                        <td>
                            <p>Fulfilling contracts</p>
                            <p>Our legitimate interests</p>
                            <p>Our legal obligation</p>
                        </td>
                        <td>
                            <p>
                                Being efficient about how we fulfil our legal and
                                contractual duties.
                            </p>
                            <p>
                                Our commercial interest in providing you with a good
                                service.
                            </p>
                            <p>
                                Complying with regulations that apply to us.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>
                                <b>To keep the Services up and running:</b>
                            </p>
                            <p>
                                To administer our Site for internal operations, including troubleshooting, data analysis, testing, research, statistical purposes; to ensure that
                                content from our site is presented in the most effective and secure manner for you and for your computer;
                            </p>
                        </td>
                        <td>
                            <p>Submitted Information</p>
                            <p>Device Information</p>
                        </td>
                        <td>
                            <p>Fulfilling contracts</p>
                            <p>Our legitimate interests</p>
                            <p>Our legal obligation</p>
                        </td>
                        <td>
                            <p>Being efficient about how we fulfil our legal and contractual duties.</p>
                            <p>As part of our efforts to keep our Site safe and secure.</p>
                            <p>Complying with regulations that apply to us.</p>
                        </td>
                    </tr>
                </tbody>
            </table>

            <p><b>What do we mean when we say:</b></p>
            <p>
                <b>Legitimate Interest:</b> this means the interest of ours as a business in conducting and managing the Site to enable us to provide to you the Services and
                offer the most secure experience. We make sure we consider and balance any potential impact on you (both positive and negative) and your rights before we process
                your personal data for our legitimate interests. We do not use your personal data for activities where our interests are overridden by the impact on you (unless
                we have your consent or are otherwise required or permitted to by law).
            </p>
            <p>
                <b>Fulfilling a Contract:</b> this means processing your data where it is necessary for the performance of a contract to which you are a party or to take steps
                at your request before entering into such a contract.
            </p>
            <p>
                <b>Our Legal Obligation:</b> this means processing your personal data where it is necessary for compliance with a legal or regulatory obligation that we are
                subject to.
            </p>
            
            <h2>7. Storage Security & International Transfers</h2>
            <p>
                The data that we collect from you will be transferred to, and stored at, a destination inside the European Economic Area (EEA). As we provide an international
                service your data may be processed outside of the EEA in order for us to fulfill our contract with you to provide the Services. We will need to process your
                personal data in order for us, for example, to action a request made by you to execute an international payment, process your payment details provide ongoing
                support services. We will take all steps to ensure that your data is treated securely and in accordance with this privacy policy.
            </p>
            <p>
                All information you provide to us is stored on our secure servers. Any payment transactions carried out by payment processing services will be encrypted using
                Secured Sockets Layer technology. Where we have given you (or where you have chosen) a password that enables you to access certain parts of our Site, you are
                responsible for keeping this password confidential. We ask you not to share a password with anyone.
            </p>
            <p>
                Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot
                guarantee the security of your data transmitted to our Site; any transmission is at your own risk. Once we have received your information, we will use strict
                procedures and security features to try to prevent unauthorized access.
            </p>
            <p>
                The Site include social networking, chat room or forum features. Ensure when using these features that you do not submit any personal data that you do not want
                to be seen, collected or used by other users.
            </p>

            <h2>8. Disclosure of Your Information</h2>
            <p>
               We send personal data to the following sets of data processors in order to perform the Services:
            </p>
            <p>
                a) Cloud storage providers
            </p>
            <p>
                This is in order to safely and securely store your data with the Site;
            </p>
            <p>
                b) Regulators and law enforcement
            </p>
            <p>
                We may also disclose your personal information in case we are under a duty to disclose or share your personal data in order to comply with any legal or regulatory
                obligation or request.
            </p>

            <h2>9. Your Legal Rights</h2>
            <p>
                You have rights under data protection laws in relation to your personal data. Please see below to find out more about these rights:
            </p>
            <p>
                You have the right to:
            </p>
            <p>
                <b>Request access to your personal data (commonly known as a "data subject access request").</b> This enables you to receive a copy of the personal data we hold
                about you. If you require this, then please reach out to our support team via the contact form.
            </p>
            <p>
                <b>Request correction of the personal data that we hold about you.</b> This enables you to have any incomplete or inaccurate data we hold about you corrected,
                though we may need to verify the accuracy of the new data you provide to us. If you require this, then please reach out to our support team via the contact form.
            </p>
            <p>
                <b>Request erasure of your personal data.</b> This enables you to ask us to delete or remove personal data where there is no good reason for us continuing to
                process it. You also have the right to ask us to delete or remove your personal data where you have successfully exercised your right to object to processing
                (see below), where we may have processed your information unlawfully or where we are required to erase your personal data to comply with local law. Note, however,
                that we may not always be able to comply with your request of erasure for specific legal reasons which will be notified to you, if applicable, at the time of your
                request. We are under certain law obligations to retain certain data for a minimum of 10 years (see above). Please note that these retention requirements supersede
                any right to erasure requests under applicable data protection laws.
            </p>
            <p>
                <b>Object to processing of your personal data.</b> This is in situations where we are relying on a legitimate interest (or those of a third party) and there is
                something about your particular situation which makes you want to object to processing on this ground as you feel it impacts on your fundamental rights and
                freedoms. In some cases, we may demonstrate that we have compelling legitimate grounds to process your information which override your rights. Please note that
                these requirements supersede any right to objection requests under applicable data protection laws. If you object to the processing of certain data then we may
                not be able to provide the Services and it is likely we will have to terminate your account.
            </p>
            <p>
                <b>Request restriction of processing of your personal data.</b> This enables you to ask us to suspend the processing of your personal data in the following
                scenarios: (a) if you want us to establish the data's accuracy; (b) where our use of the data is unlawful but you do not want us to erase it; (c) where you need
                us to hold the data even if we no longer require it as you need it to establish, exercise or defend legal claims; or (d) you have objected to our use of your data
                but we need to verify whether we have overriding legitimate grounds to use it. Please note that any requests in relation to the restriction of the processing of
                your data means that we may not be able to perform the contract we have or are trying to enter into with you (including the Services). In this case, we may have
                to cancel your use of the Services but we will notify you if this is the case at the time.
            </p>
            <p>
                <b>Request the transfer of your personal data to you or to a third party.</b> We will provide to you, your personal data in a structured, commonly used,
                machine-readable format, which you can then transfer to an applicable third party. Note that this right only applies to automated information which you initially
                provided consent for us to use or where we used the information to perform a contract with you. If you require this then please reach out to our support team via
                the contact form.
            </p>
            <p>
                <b>Withdraw consent at any time where we are relying on consent to process your personal data.</b> However, this will not affect the lawfulness of any processing
                carried out before you withdraw your consent. If you withdraw your consent, we may not be able to provide the Services to you. We will advise you if this is
                the case at the time you withdraw your consent.
            </p>

            <h3>NO FEE USUALLY REQUIRED</h3>
            <p>
                You will not have to pay a fee to access your personal data (or to exercise any of the other rights). However, we may charge a reasonable fee if your request is
                clearly unfounded, repetitive or excessive. Alternatively, we may refuse to comply with your request in these circumstances.
            </p>

            <h3>WHAT WE MAY NEED FROM YOU</h3>
            <p>
                We may need to request specific information from you to help us confirm your identity and ensure your right to access your personal data (or to exercise any of
                your other rights). This is a security measure to ensure that personal data is not disclosed to any person who has no right to receive it. We may also contact you
                to ask you for further information in relation to your request to speed up our response.
            </p>

            <h3>TIME LIMIT TO RESPOND</h3>
            <p>
                We try to respond to all legitimate requests within two months. Occasionally it may take us longer than two months if your request is particularly complex or you
                have made a number of requests. In this case, we will notify you and keep you updated.
            </p>

            <h3>IF YOU FAIL TO PROVIDE PERSONAL DATA</h3>
            <p>
                Where we need to collect personal data by law, or under the terms of a contract we have with you and you fail to provide that data when requested, we may not be
                able to perform the contract we have or are trying to enter into with you (including the Services). In this case, we may have to cancel your use of the Services
                but we will notify you if this is the case at the time.
            </p>

            <h2>10. Changes to Privacy Policy</h2>
            <p>
                Any changes we may make to our privacy policy in the future will be posted on this page. The new terms may be displayed on-screen and you may be required to read
                and accept them to continue your use of Services.
            </p>
            <h2>11. Contact</h2>
            <p>
                All questions relating to data and your privacy are welcomed and should be addressed to our support team. If you have any questions, comments or requests regarding
                this privacy policy then please contact the Site support team via the <ExternalLink href="https://whalessecret.com/contact-us">Whale's Secret contact
                form</ExternalLink>.
            </p>
            <p class="last-updated">
                <strong>Last updated: May 1, 2026</strong>
            </p>
        </div>
    );
};

export default Privacy;
