# Product Proposal: Blind NFT Art Auction Room

## Problem

Collectors need a fair auction where bids remain sealed until the reveal phase.

## Proposed product

Blind NFT Art Auction Room gives a featured lot a commit–reveal bidding lifecycle and publishes only the final winner state.

## Privacy model

Auction phase and winning result are public. Losing bid amounts, salts, and unrevealed commitments remain private until their owners reveal them.

## User journey

1. Collector submits a commitment for the lot.
2. Administrator opens the reveal phase.
3. Collector reveals the matching amount and salt.
4. Contract closes with the highest valid bid.

## Success criteria

- Commitments are accepted only during bidding.
- Invalid reveals fail.
- Higher valid bids replace the current winner.
- Closed auctions cannot accept new commitments.

