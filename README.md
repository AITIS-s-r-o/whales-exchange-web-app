# Whale's Exchange Web App

This repository contains the official Whale's Exchange App served at
[whales.exchange](https://whales.exchange). It enables **non-custodial** swaps
across different Bitcoin layers based on the Electrum Swap protocol.

The app was forked from [boltz-web-app](https://github.com/BoltzExchange/boltz-web-app).

## Architecture

The Whale's Exchange App is built using SolidJS and TypeScript for the frontend. It interacts with the backend services that handle the swap logic and operations. The backend services are available in separate repositories:

* https://github.com/AITIS-s-r-o/electrum-swap-backend - Electrum server that facilitates the actual swaps
* https://github.com/AITIS-s-r-o/whales-exchange-backend - Backend service in .NET (C#) that communicates with the Electrum swap server and provides APIs for the frontend app

```
┌──────────────────────────────────────────────────────────────────┐
│                    Whale's Exchange System                       │
└──────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────┐
│   whales-exchange-web-app           │
│   (SolidJS + TypeScript Frontend)   │
└──────────────────┬──────────────────┘
                   │
                   │ WebSocket Connection + HTTP API Calls
                   │
                   ▼
┌─────────────────────────────────────┐
│  whales-exchange-backend            │
│  (.NET / C# Backend Service)        │
└──────────────────┬──────────────────┘
                   │
                   │ RPC Requests
                   │
                   ▼
┌─────────────────────────────────────┐
│   electrum-swap-backend             │
│   (Electrum Swap Server)            │
└─────────────────────────────────────┘
```


## Contributing

We welcome contributions to the Whale's Exchange App! If you have an idea for a new feature, improvement, or bug fix, please submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

To run the web app locally from source, follow these instructions:

```bash
npm install
npm run mainnet # Choices are: mainnet / testnet / regtest
npm run dev
```

## Resources

- Get Help: [Support Center](https://whales.exchange/about)
- Follow us: [X/Twitter](https://x.com/WhalesSecret)
