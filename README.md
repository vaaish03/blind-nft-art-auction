# Blind NFT Art Auction Room

![Frontend CI](https://github.com/vaaish03/blind-nft-art-auction/actions/workflows/frontend-ci.yml/badge.svg?branch=main) ![Contract CI](https://github.com/vaaish03/blind-nft-art-auction/actions/workflows/contract-ci.yml/badge.svg?branch=main)

A gallery-style commit–reveal auction for collectors who want private bidding and a verifiable winner.

## Collector preview catalogue

- Lot thesis and market need — [PROPOSAL.md](./PROPOSAL.md)
- Six auction behaviors — [blind.test.ts](./src/test/blind.test.ts)
- Curator’s test checklist — [TESTING.md](./TESTING.md)
- On-chain provenance — [deployment.json](./deployment.json)

## Gallery experience

The app presents a single featured lot with an auction state that is easy to read:

- submit a sealed bid commitment;
- wait for the reveal window;
- reveal only with the matching salt;
- close the auction and publish the winning state.

The blue-and-gold dashboard pairs the artwork context with wallet readiness, phase, privacy notes, contract identity, and confirmed transaction history.

## Auction contract

The `blind_auction` Compact contract exposes:

- `submitCommitment(commitment)`
- `transitionToReveal()`
- `revealBid()`
- `closeAuction()`
- `computeCommitment(amount, salt, sk)`

The ledger records phase, commitments, highest bid, winner, and administrator state. Losing bids and salts remain private.

## Live Preview coordinates

| Field | Value |
| --- | --- |
| Network | Midnight Preview |
| Contract | `blind_auction` |
| Address | `762c643cdc619989b4eaf1ce8d9e48ab234112229a32d73496e641b1ff405659` |
| Deployment transaction | `004b0e9d6b5e63e1234c170e9c8fc3aa8d132e873e737690abbce93f9bd0642626` |
| Gallery deployer | `mn_addr_preview17kavjqm9qqqnvm32ns9jr2j35m8r3naqz0k2x936mwt8wmg7x0nsk94maa` |
| Opened on-chain | `2026-08-03T19:11:57.338Z` |
| Status | Confirmed by Midnight Preview indexer |

## Try the project

Collector test wallets can be funded from the [Preview faucet](https://faucet.preview.midnight.network/).

```bash
npm install
npm run compile
npm test
npm run build
npm run dev
```

For a deliberate testnet deployment, configure the wallet/provider first and run:

```bash
npm run deploy
```

Use test artwork metadata, testnet funds, and never upload private salts or recovery phrases.

## Release assurance

Frontend CI checks the production build; contract CI recompiles and tests the Compact artifact. Tag-based release automation publishes a manifest and build bundle. Dependency audit runs separately from the wallet path.

Demo: [visit the gallery auction walkthrough](https://drive.google.com/file/d/14DGE5vCvNDe4mkFjSuvGq6Wy2gZKy09v/view?usp=sharing).

## Verification

Privacy is the product feature: collector bid amounts remain hidden through commitment, while only the permitted reveal and winning state are public. Run `npm test`, `npm run compile`, and `npm run build`; the six contract scenarios are documented in [TESTING.md](./TESTING.md), the product scope is in [PROPOSAL.md](./PROPOSAL.md), and both CI workflows run on every push and pull request.

## Gallery auction safety

Before operating Blind NFT Art Auction, read the independent [security model](SECURITY.md) and [operations runbook](OPERATIONS.md). Runtime configuration is fail-closed and its executable checks live in [src/test/runtime-config.test.ts](src/test/runtime-config.test.ts).
