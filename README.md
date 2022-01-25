# Description

This project is intended to provide an easy and efficient way to exchange tokens on Tezos blockchain in a wide number of directions. Using smart contracts listed in this repo users can add their tokens to exchange, provide liquidity, and potentially make a profit in a fully decentralized way.

The current implementation supports [FA1.2](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-7/tzip-7.md) and [FA2](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

# Architecture

The solution consists of the single contract that serves as the automatic market maker engine and register of the new pairs.

# Project structure

```
.
├──  ci/ # scripts for continues integration
├──  contracts/ # contracts
|──────── main/ # the contracts to be compiled
|──────── partial/ # the code parts imported by main contracts
├──  test/ # test cases
├──  storage/ # initial storage for contract originations
├──  scripts/ # cli for dex/factory actions
├──  README.md # current file
├──  .env
├──  .gitignore
└──  package.json
```

# Prerequisites

- Installed NodeJS (tested with NodeJS v12+)

- Installed Ligo:

```
curl https://gitlab.com/ligolang/ligo/raw/dev/scripts/installer.sh | bash -s "next"
```

- Installed node modules:

```
cd quipuswap-token2token-core && npm install
```

- Configure `env.js` if needed.

# Quick Start

```
nom run start-sandbox
nom run compile
nom run migrate
```

For other networks:

```
npm run migrate -- --network NAME
```

# Usage

Contracts are processed in the following stages:

1. Compilation
2. Deployment
3. Configuration
4. Interactions on-chain

## Compilation

To compile the contracts run:

```
npm run compile
```

Artifacts are stored in the `build/contracts` directory.

## Deployment

For deployment step the following command should be used:

```
npm run migrate
```

Addresses of deployed contracts are displayed in terminal. At this stage, Dex is originated. Aditionaly, for testnets two new pairs are deployed.

# Testing

If you'd like to run tests on the local environment, you might want to run local node for Tezos using the following command:

```
npm run start-sandbox
```

To execute tests run:

```
npm run test
```
