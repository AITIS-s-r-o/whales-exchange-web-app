import { useGlobalContext } from "../context/Global";
import "../style/help.scss";
import ExternalLink from "../components/ExternalLink";

const Help = () => {
    const { t } = useGlobalContext();

    return (
        <div class="help-container">
            <h1>{t("help")}</h1>

            <ol>
                <li><a href="#what-is-whales-exchange-what-is-submarine-swap">What is Whale's Exchange, what is Submarine Swap?</a></li>
                <li><a href="#how-do-i-perform-a-forward-swap">How do I perform a Forward Swap?</a></li>
                <li><a href="#how-do-i-perform-a-reverse-swap">How do I perform a Reverse Swap?</a></li>
                <li><a href="#how-are-swap-providers-ordered">How are swap providers ordered in the list of swap providers?</a></li>
                <li><a href="#how-can-i-run-a-swap-provider">How can I run a swap provider?</a></li>
                <li><a href="#where-is-the-source-code">Where is the source code?</a></li>
            </ol>

            <h2 id="what-is-whales-exchange-what-is-submarine-swap">1. What is Whale's Exchange, what is Submarine Swap?</h2>
            <p>
                Please see the <a href="/about">About</a> page for more information about Whale's Exchange and Submarine Swaps.
            </p>

            <h2 id="how-do-i-perform-a-forward-swap">2. How do I perform a Forward Swap?</h2>
            <p>
                Currently, only Reverse Swaps are supported. If you are interested in this feature, or you want to help us implement it, please <a href="/contact">contact us</a>.
            </p>

            <h2 id="how-do-i-perform-a-reverse-swap">3. How do I perform a Reverse Swap?</h2>
            <p>
                To perform a Reverse Swap:
            </p>
            <ol>
                <li>
                    Go to <a href="/">the main page</a> and select a swap provider from the list of providers. Each swap provider has different liquidity (as specified by Max
                    Reverse) and fees and these parameters can change over time.
                </li>
                <li>Enter the amount you want to swap, or the amount you want to receive.</li>
                <li>Enter your destination on-chain address. Always use a previously unused address.</li>
                <li>Click the "Create Atomic Swap" button.</li>
                <li>
                    <p>
                        If the swap request is accepted, you will be presented with two Lightning invoices. There is a fee invoice that demonstrates the commitment of the user to
                        perform the swap and which covers transaction fees for transactions that the swap provider needs to broadcast on chain. <b>Note that this fee invoice
                        is not atomically linked to the swap and therefore it is not trustless.</b> The amount in the fee invoice can be lost if the swap provider is malicious.
                    </p>
                    <p>
                        The second invoice is the swap invoice which is atomically linked to the swap. Therefore, funds sent via this invoice are protected by the atomicity of the
                        swap and cannot be lost due to malicious behavior of the swap provider as long as the user follows the instructions. If the swap provider stops cooperating,
                        the invoice payment will eventually expire and fail and the user will get the funds back.
                    </p>
                    <p>
                        You have to pay both invoices before they expire. The swap providers currently set the expiration of these invoices to 5 minutes. Note that when you pay
                        the invoices, they will not complete immediately. They will appear as "pending" or "on-hold" in your wallet until the swap provider verifies the payment.
                        After that the fee invoice will complete and the swap invoice will remain pending until your web browser claims the on-chain funds that the swap provider
                        will broadcast after verifying the payment.
                    </p>
                </li>
                <li>
                    <p>
                        After you pay the invoices, <b>YOU MUST KEEP YOUR BROWSER OPEN</b> while the swap provider will verify the payment and broadcast the on-chain transaction to
                        complete the swap. If you close your browser before the swap is completed, your browser will not claim the on-chain funds and a malicious provider could
                        eventually steal them after a timelock on the on-chain transaction expires. However, you do not need to worry in case of power failure or accidental
                        closure of the browser, or a browser crash. If you reopen the swap page before the on-chain transaction expires, the browser will claim the on-chain funds
                        and complete the swap as soon as the swap provider broadcasts the on-chain transaction.
                    </p>
                    <p>
                        Simply keep your browser open and wait for the completion of the swap. In case the browser is closed for whatever reason, remember to reopen it as soon as
                        possible.
                    </p>
                </li>
            </ol>

            <h2 id="how-are-swap-providers-ordered">4. How are swap providers ordered in the list of swap providers?</h2>
            <p>
                Currently, we follow Electrum Wallet implementation which orders swap providers based on the proof-of-work of their announcement. In order to set up a swap server,
                swap provider needs to publish an announcement through Nostr relays. This announcement includes a hash of the swap provider's public key and a proof-of-work that
                demonstrates the swap provider's commitment to providing liquidity. The more proof-of-work a swap provider has, the higher they are ranked in the list of swap
                providers.
            </p>
            <p>
                In the future, we want to implement our own scoring system based on statistics of swap providers' performance and reliability.  Please <a href="/contact">contact
                us</a> if you want to help us.
            </p>

            <h2 id="how-can-i-run-a-swap-provider">5. How can I run a swap provider?</h2>
            <p>
                Please read <a href="https://electrum.readthedocs.io/en/latest/swapserver.html">How to offer Submarine Swaps</a> in Electrum Wallet documentation.
            </p>

            <h2 id="where-is-the-source-code">6. Where is the source code?</h2>
            <p>
                The source code of Whale's Exchange is available on GitHub:
            </p>
            <ul>
                <li><ExternalLink href="https://github.com/AITIS-s-r-o/whales-exchange-web-app">Whale's Exchange Web App</ExternalLink> (this frontend application);</li>
                <li>
                    <ExternalLink href="https://github.com/AITIS-s-r-o/whales-exchange-backend">Whale's Exchange Backend</ExternalLink> (API bridge to Electrum backend RPC in
                    .NET);
                </li>
                <li>
                    <ExternalLink href="https://github.com/AITIS-s-r-o/electrum-swap-backend">Whale's Exchange Electrum Swap Bridge</ExternalLink> (modified Electrum wallet
                    used to communicate with Electrum Swap providers).
                </li>
            </ul>

        </div>
    );
};

export default Help;
