# Blind NFT Art Auction Room

![Frontend CI](https://github.com/vaaish03/blind-nft-art-auction/actions/workflows/frontend-ci.yml/badge.svg?branch=main) ![Contract CI](https://github.com/vaaish03/blind-nft-art-auction/actions/workflows/contract-ci.yml/badge.svg?branch=main)

A gallery-style commit–reveal auction for collectors who want private bidding and a verifiable winner.

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

## Live Preprod coordinates

| Field | Value |
| --- | --- |
| Network | Midnight Preprod |
| Contract | `blind_auction` |
| Address | `75fc78b6a36688bce8f0326d69eedb798a5b24f275c355454e27a1c2a7c03024` |
| Deployment transaction | `c620c1e3708e1e7093dec838e315f889e2050daab10eb82098d28b3ad39ed4b6` |
| Status | Confirmed by Midnight Preprod indexer |

## Try the project

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
