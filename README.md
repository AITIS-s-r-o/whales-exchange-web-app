# Whale's Exchange Web App

This repository contains the official Whale's Exchange Web App served at [whales.exchange](https://whales.exchange). It enables **non-custodial** swaps across different Bitcoin layers
based on the [Electrum Swap protocol](https://electrum.readthedocs.io/en/latest/swapserver.html).

The app was forked from [boltz-web-app](https://github.com/BoltzExchange/boltz-web-app).

## Design

The Whale's Exchange Web App allows users to do atomic swaps on Bitcoin with a simple-to-use interface accessible through your browser without needing to install Electrum. The Web app interacts with the [backend service](https://github.com/AITIS-s-r-o/whales-exchange-backend) which facilitates the swap logic and operations by communicating with the [Electrum Swap Server](https://github.com/AITIS-s-r-o/electrum-swap-backend).

Architecturally, the system consists of three main components:

```
┌───────────────────────────────────────────────────────────────┐      ┐             ┐
│   Whale's Exchange Frontend                                   │      │             │
│                                                               │      │  Client     │
│   Code: SolidJS in TypeScript                                 │      │  Machine    │
│   https://github.com/AITIS-s-r-o/whales-exchange-web-app      │      │             │
└──────────────────┬────────────────────────────────────────────┘      ┘             │
                   │                                                                 │
                   │ WebSocket Connection + HTTP API Calls                           │
                   │                                                                 │
                   ▼                                                                 │
┌───────────────────────────────────────────────────────────────┐      ┐             │
│  Whale's Exchange Backend                                     │      │             │
│                                                               │      │             │  Whale's
│  Code: .NET / C# Backend Service                              │      │             │  Exchange
│  https://github.com/AITIS-s-r-o/whales-exchange-backend       │      │             │
└──────────────────┬────────────────────────────────────────────┘      │             │
                   │                                                   │  Server     │
                   │ RPC Requests                                      │  Machine    │
                   │                                                   │             │
                   ▼                                                   │             │
┌───────────────────────────────────────────────────────────────┐      │             │
│   Electrum Swap Server                                        │      │             │
│                                                               │      │             │
│   Code: Python                                                │      │             │
│   Link: https://github.com/AITIS-s-r-o/electrum-swap-backend  │      │             │
└──────────────────┬────────────────────────────────────────────┘      ┘             ┘
                   │                                                   
      ┌────────────┼────────────┬─────────────┐                        
      │            │            │             │                        
      ▼            ▼            ▼             ▼                        
 ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐                   ┐  
 │   Swap   │ │   Swap   │ │   Swap   │ │   Swap   │                   │ External
 │ Provider │ │ Provider │ │ Provider │ │ Provider │                   │ Services
 │    1     │ │    2     │ │    3     │ │    N     │                   │ 
 └──────────┘ └──────────┘ └──────────┘ └──────────┘                   ┘
```


## Contributing

We welcome contributions to the Whale's Exchange! If you have an idea for a new feature, improvement, or bug fix, please submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

To run the web app locally from source for development, follow these instructions:

```bash
npm install
npm run mainnet # Choices are: mainnet / testnet / regtest
npm run dev
```

To run the web app in production, follow these instructions:

```bash
npm install
npm run mainnet && npm run build
npx serve dist
```

The project can be built and run on Linux and Windows (WSL or Git Bash). The project _should_ run on macOS but it is not actively tested.

## Tested Scenarios

The following scenarios are tested during development:

### Forward Swap
  - Successful swap 1
    - Client enters BOLT11 invoice -> client receives instructions for on-chain payment.
    - Client pays immediately.
    - Block 1 is mined -> client receives LN payment from swap provider.
    - Block 2 is mined -> swap provider claims and the swap is concluded.
  - Successful swap 2
    - Client enters BOLT11 invoice -> client receives instructions for on-chain payment.
    - Blocks 1-8 are mined.
    - Client pays.
    - Block 9 is mined -> client receives LN payment from swap provider.
    - Block 10 is mined -> swap provider claims and the swap is concluded.
  - Payment too late 1
    - Client enters BOLT11 invoice -> client receives instructions for on-chain payment.
    - Blocks 1-9 are mined.
    - Swap is marked as expired -> error message "Client failed to send the funding on-chain transaction" is displayed. Client is expected to refresh if they paid later.
    - Client pays.
    - Block 10 is mined.
    - Client refreshes the page -> client is informed about possibility to get refund after timelock expires.
    - Blocks 11-69 are mined.
    - Client refreshes the page -> no change.
    - Block 70 is mined.
    - Client refreshes the page -> client can get refund now.
    - Client enters on-chain addres for refund and submits.
    - Refund transaction is broadcasted. Client sees it in their wallet.
  - Payment too late 2
    - Client enters BOLT11 invoice -> client receives instructions for on-chain payment.
    - Blocks 1-9 are mined.
    - Client pays before the swap is marked as expired -> client sees transaction in mempool and then confirmed, but no payment arrives for the invoice.
    - Block 10-69 is mined.
    - Client refreshes the page -> no change.
    - Block 70 is mined.
    - Client can get refund now.
    - Client enters on-chain addres for refund and submits.
    - Refund transaction is broadcasted. Client sees it in their wallet.
  - Payment too late 3
    - Client enters BOLT11 invoice -> client receives instructions for on-chain payment.
    - Blocks 1-70 are mined.
    - Client pays.
    - Client refreshes the page -> client can get refund now.
    - Client enters on-chain addres for refund and submits.
    - Refund transaction is broadcasted. Client sees it in their wallet.

## Resources

- Get Help: [Support Center](https://t.me/whales_secret_support)
- Follow us: [X/Twitter](https://x.com/WhalesSecret)

