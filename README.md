# Whale's Exchange Web App

This repository contains the official Whale's Exchange Web App served at [whales.exchange](https://whales.exchange). It enables **non-custodial** swaps across different Bitcoin layers
based on the [Electrum Swap protocol](https://electrum.readthedocs.io/en/latest/swapserver.html).

The app was forked from [boltz-web-app](https://github.com/BoltzExchange/boltz-web-app).

## Design

The Whale's Exchange Web App allows users to do atomic swaps on Bitcoin with a simple-to-use interface accessible through your browser without needing to install Electrum. The Web app interacts with the [backend service](https://github.com/AITIS-s-r-o/whales-exchange-backend) which facilitates the swap logic and operations by communicating with the [Electrum Swap Server](https://github.com/AITIS-s-r-o/electrum-swap-backend).

Architecturally, the system consists of three main components:

```
┌───────────────────────────────────────────────────────────────┐      ┐                 ┐
│   Whale's Exchange Frontend                                   │      │                 │
│                                                               │      │  Client         │
│   Code: SolidJS in TypeScript                                 │      │  Machine        │
│   https://github.com/AITIS-s-r-o/whales-exchange-web-app      │      │                 │
└──────────────────┬────────────────────────────────────────────┘      ┘                 │
                   │                                                                     │
                   │ WebSocket Connection + HTTP API Calls                               │
                   │                                                                     │
                   ▼                                                                     │
┌───────────────────────────────────────────────────────────────┐      ┐                 │
│  Whale's Exchange Backend                                     │      │                 │
│                                                               │      │                 │   Whale's
│  Code: .NET / C# Backend Service                              │      │                 │   Exchange
│  https://github.com/AITIS-s-r-o/whales-exchange-backend       │      │                 │
└──────────────────┬────────────────────────────────────────────┘      │                 │
                   │                                                   │  Server         │
                   │ RPC Requests                                      │  Machine        │
                   │                                                   │                 │
                   ▼                                                   │                 │
┌───────────────────────────────────────────────────────────────┐      │                 │
│   Electrum Swap Server                                        │      │                 │
│                                                               │      │                 │
│   Code: Python                                                │      │                 │
│   Link: https://github.com/AITIS-s-r-o/electrum-swap-backend  │      │                 │
└──────────────────┬────────────────────────────────────────────┘      ┘                 ┘
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

To run the web app locally from source, follow these instructions:

```bash
npm install
npm run mainnet # Choices are: mainnet / testnet / regtest
npm run dev
```

The project can be built and run on Linux and Windows (WSL or Git Bash). The project _should_ run on macOS but it is not actively tested.

## Resources

- Get Help: [Support Center](https://t.me/whales_secret_support)
- Follow us: [X/Twitter](https://x.com/WhalesSecret)
