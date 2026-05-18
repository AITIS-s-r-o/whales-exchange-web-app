import { useGlobalContext } from "../context/Global";
import "../style/about.scss";
import ExternalLink from "../components/ExternalLink";

const About = () => {
    const { t } = useGlobalContext();

    return (
        <div class="about-container">
            <h1>{t("about")}</h1>
            <p>
                Whale's Exchange is an <ExternalLink href="https://github.com/AITIS-s-r-o/whales-exchange-web-app/">open-source</ExternalLink> non-custodial 
                <ExternalLink href="https://bitcoinops.org/en/newsletters/2025/07/18/#electrum-4-6-0-released">Electrum Swap</ExternalLink> interface based on 
                <ExternalLink href="https://boltz.exchange">Boltz Exchange</ExternalLink> frontend. To understand what Whale's Exchange is, it is important to understand what
                submarine swaps are and also understand the two projects that it is built on.
            </p>
            
            <h2>Submarine Swaps</h2>
            <p>
                Submarine swaps are a type of atomic swap that allows users to exchange on-chain bitcoin with off-chain bitcoin and vice-versa. Lightning Network users may
                sometimes have too little or too much liquidity in their channels, and submarine swaps allow them to swap between on-chain and off-chain bitcoin without trusting
                a third party custodian.
            </p>
            <p>
                A Forward Swap (BTC→LN) is a swap where the user swaps on-chain bitcoin (BTC) for off-chain bitcoin (LN).
            </p>
            <p>
                A Reverse Swap (LN→BTC) is a swap where the user swaps off-chain bitcoin (LN) for on-chain bitcoin (BTC).
            </p>
            <p>
                For more information about submarine swaps, please refer to the following resources:
            </p>
            <ul>
                <li>
                    <ExternalLink href="https://docs.lightning.engineering/the-lightning-network/multihop-payments/understanding-submarine-swaps">Understanding Submarine
                    Swaps by Lightning Labs</ExternalLink>
                </li>
                <li>
                    <ExternalLink href="https://www.lightspark.com/glossary/submarine-swap">Submarine Swaps: The Essential Bitcoin and Fintech Bridge by Lightspark</ExternalLink>
                </li>
            </ul>

            <h2>Boltz Exchange</h2>
            <p>
                Boltz Exchange pioneered the concept of atomic swaps on Bitcoin with simple to use interface. It evolved into a web service that allows users to swap between
                various digital assets, not just Bitcoin, on different layers and chains.
            </p>

            <h2>Electrum Wallet</h2>
            <p>
                Electrum is a popular Bitcoin wallet that has been around since 2011. It is a feature rich wallet and often among first ones to implement new Bitcoin features.
            </p>
            <p>
                Electrum Swap is a protocol that pushes the concept of atomic swaps on Bitcoin to the next level by decentralizing the swap process and allowing anyone to run
                a swap server. It leverages <ExternalLink href="https://nostr.com/">Nostr</ExternalLink> that is used by the swap providers to publish their swap offers
                and to arrange swaps with the clients.
            </p>

            <h2>Whale's Exchange</h2>
            <p>
                Whale's Exchange combines Boltz Exchange web interface with Electrum Swap. It allows participating in Electrum swaps without needing to run Electrum wallet.
                This allows expanding the user base of Electrum Swap ecosystem to more users.
            </p>
            <p>
                While the web interface and the background API bridge are obviously centralized, the swaps themselves preserve the trust-minimized character that is inherent to
                Electrum Swap protocol. Whale's Exchange never gains access to user funds, and users retain full control of their bitcoin throughout the entire flow of a swap.
            </p>
            <p>
                Of course, the user always needs to trust the interface they are using, whether it is Whale's Exchange web interface or whether it is Electrum Wallet. Electrum
                Wallet is a much more mature project that has been around for more than a decade, and it has a solid reputation. Whale's Exchange is a new project that still needs
                to build its reputation and trust among its users. To achieve that, all parts of Whale's Exchange are open source, and we encourage everyone to review the code and
                verify that it does what it is supposed to do; or even better, to run your own instance of Whale's Exchange, locally or on your own domain with your own branding.
            </p>
            <p>
                Therefore, we can say that Whale's Exchange is somewhere in between Electrum Wallet and Boltz Exchange in terms of how much trust you have to put into it as a user.
            </p>
            <p>
                Whale's Exchange does not receive any fees from the swaps as it does not participate in the swaps at all. It only facilitates communication between the user
                and the swap providers.
            </p>

            <h2>Company</h2>
            <p>
                Whale's Exchange is a project of AITIS s.r.o., a privately held Czech Republic company:
            </p>
            <div class="company-info">
                AITIS s.r.o.<br />
                Vyšehradská 1349/2<br />
                128 00, Prague<br />
                Czech Republic<br />
                Reg. no.: 24661007<br />
                Tax ID: CZ24661007<br />
                Incorporation: Commercial register maintained by the Municipality court in Prague, Section C, Insert 164187<br />
            </div>
            <p>
                AITIS s.r.o. is also a creator of <ExternalLink href="https://whalessecret.com/">Whale's Secret &ndash; unified .NET API for digital asset
                platforms</ExternalLink>.
            </p>
        </div>
    );
};

export default About;
