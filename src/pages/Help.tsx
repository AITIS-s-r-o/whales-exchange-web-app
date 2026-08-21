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
                <li><a href="#how-to-rescue-a-failed-forward-swap">How to rescue a failed Forward Swap?</a></li>
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
                To perform a Forward Swap:
            </p>
            <ol>
                <li>
                    <p>
                        Go to <a href="/">the main page</a> and select a swap provider from the list of providers. Each swap provider has different liquidity (as specified by Max
                        Forward) and fees and these parameters can change over time. Some providers may not support Forward Swaps. In that case their Max Forward liquidity is set
                        to "N/A".
                    </p>
                </li>
                <li>
                    <p>
                        Make sure that you have Bitcoin first and Lightning second in the Create Atomic Swap section. If not, you are currently viewing a form for a reverse swap.
                        Click the down arrow between the asset lines to switch to the form for a forward swap.
                    </p>
                </li>
                <li>
                    <p>
                        Copy and paste a BOLT11 Lightning invoice that includes amount in the text area below. This will automatically fill in the amounts to be paid and to be
                        received. Always use a newly generated BOLT11 invoice. Invoices without amount are not supported.
                    </p>
                </li>
                <li>Click the "Create Atomic Swap" button.</li>
                <li>
                    <p>
                        If the swap request is accepted, you will be presented with an on-chain address and an amount to pay. Make sure your transaction confirms within 9 blocks.
                        Otherwise, the swap provider will ignore the swap. In that case, you will not lose the paid amount, but you will lose the mining fees. Also make sure to pay
                        the exact amount specified by the swap provider in one single transaction. If you pay in multiple transactions you may lose funds.
                    </p>
                    <p>
                        Note that the funds sent to this address are protected if the selected swap provider is non-cooperative or malicious. If the swap provider does not finish
                        the swap for whatever reason, you can come to rescue your funds after your funding transaction gets more than 70 confirmations. However, the network fees
                        paid to miners cannot be refunded - neither from the funding transaction, nor from the rescue transaction. See 
                        <a href="#how-to-rescue-a-failed-forward-swap">How to rescue a failed Forward Swap?</a>.
                    </p>
                </li>
                <li>
                    <p>
                        After you make the payment, the swap provider waits for the transaction to confirm. Once confirmed, the swap provider should pay the Lightning invoice that
                        you provided at the beginning. After the second confirmation of the funding transaction, the swap provider will claim their on-chain funds and this will
                        conclude the swap.
                    </p>
                </li>
            </ol>

            <h2 id="how-do-i-perform-a-reverse-swap">3. How do I perform a Reverse Swap?</h2>
            <p>
                To perform a Reverse Swap:
            </p>
            <ol>
                <li>
                    <p>
                        Go to <a href="/">the main page</a> and select a swap provider from the list of providers. Each swap provider has different liquidity (as specified by Max
                        Reverse) and fees and these parameters can change over time.
                    </p>
                </li>
                <li>
                    <p>
                        Make sure that you have Lightning first and Bitcoin second in the Create Atomic Swap section. If not, you are currently viewing a form for a forward swap.
                        Click the down arrow between the asset lines to switch to the form for a reverse swap.
                    </p>
                </li>
                <li>
                    <p>
                        Enter the amount you want to swap, or the amount you want to receive.
                    </p>
                </li>
                <li>
                    <p>
                        Enter your destination on-chain address. Always use a previously unused address.
                    </p>
                </li>
                <li>
                    <p>
                        Click the "Create Atomic Swap" button.
                    </p>
                </li>
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
                        the invoices, they will not complete immediately. They will appear as "pending", "queued", or "on-hold" in your wallet until the swap provider verifies
                        the payment. After that the fee invoice will complete and the swap invoice will remain pending until your web browser claims the on-chain funds that the
                        swap provider will broadcast after verifying the payment.
                    </p>
                    <p>
                        Note: Some Lightning wallets only handle one payment at a time by default. When you pay the first HODL invoice it will stay pending (this can take up to
                        a couple of minutes). If you wait for it to finish or time out before paying the second invoice, the first payment will fail and the swap will not be
                        initiated. Pay both invoices as quickly as possible while the first one is still processing.
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

            <h2 id="how-to-rescue-a-failed-forward-swap">4. How to rescue a failed Forward Swap?</h2>
            <p>
                If you paid on-chain for a forward swap and the swap provider did not complete the swap, you can rescue your funds after your funding transaction gets more than
                70 confirmations. Note that in this case you will lose the mining fees paid for both, the funding transaction and for the rescue transaction, but you will get back
                the rest of the amount that you paid.
            </p>
            <ol>
                <li>
                    <p>
                        Go to <a href="/rescue">the rescue page</a> or the page of the swap. On the rescue page, you will see your swap history and at the top of the list you will
                        see swaps that can be rescued. Those swaps have a "Refund" button next to them. Click the "Refund" button to navigate to the page of the swap. If
                        the funding transaction does not yet have 70 confirmations, you will see information about when it is expected to reach 70 confirmations.
                    </p>
                </li>
                <li>
                    <p>
                        Once the funding transaction of the failed forward swap has 70 confirmations, you can initiate the rescue process. Simply enter the Bitcoin address to which
                        you want to receive the rescued funds and click the "REFUND" button. The rescue process will be initiated and you will receive the rescued funds to
                        the provided address.
                    </p>
                </li>
            </ol>

            <h2 id="how-are-swap-providers-ordered">5. How are swap providers ordered in the list of swap providers?</h2>
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

            <h2 id="how-can-i-run-a-swap-provider">6. How can I run a swap provider?</h2>
            <p>
                Please read <a href="https://electrum.readthedocs.io/en/latest/swapserver.html">How to offer Submarine Swaps</a> in Electrum Wallet documentation.
            </p>

            <h2 id="where-is-the-source-code">7. Where is the source code?</h2>
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
