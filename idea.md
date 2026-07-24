# Project Idea: Sealed-Bid Auction (Blind NFT Art Auction)

A blind bidding auction system for rare digital art or NFTs where bid values remain hidden. Once the bidding period concludes, a ZK proof is generated to resolve the auction, transferring the NFT to the winner and refunding losers without exposing individual bid amounts.

## 1. Midnight Network Specialty (ZK & Privacy Features)
*   **Sealed Mempools:** Prevents bidding bid-sniping or bidder collusion since bid parameters are stored in private contract states.
*   **Private Ledger Escrow:** Bidders deposit tokens privately. The ZK circuit processes these escrow balances and transfers the winner's funds to the artist on the private state ledger.
*   **Verifiable Resolution:** The auction winner is proven mathematically to have the highest bid commitment, without publicizing any other bid prices.

## 2. Technical Architecture (Compact Contract)
*   **Public State:**
    *   `nft_id`: Token ID of the art asset being auctioned.
    *   `status`: Setup, Open, Resolved.
    *   `bid_commitments`: Map of bidders to public bid hashes.
    *   `winner_address`: Revealed after auction resolution.
*   **Private State (per Bidder):**
    *   `bid_amount`: Numerical value of the bid.
    *   `bid_salt`: Salt to prevent hash brute-forcing.
*   **Circuits (ZK Proofs):**
    *   `generate_bid_commitment(bid_amount, bid_salt)`:
        *Output:* Returns `hash(bid_amount, bid_salt)` to publish on-chain.
    *   `evaluate_highest_bidder(losing_bids, winning_bid)`:
        1. Confirms all bid parameters match recorded commitments.
        2. Asserts that `winning_bid.amount >= losing_bids[i].amount`.
        *Output:* Confirms the winning address and sets up the private transfer of the NFT.

## 3. Frontend & Integration (Level 3 Focus)
*   **User Interface:** A gallery platform where collectors view the NFT, place their blind bids, lock their NIGHT/DUST tokens in escrow, and monitor the auction phase.
*   **Lace/Midnight Wallet Integration:**
    *   Handles local ZK proof compilations.
    *   Manages shielded escrow balances.

## 4. Verification & Testing Plan
*   **Unit Tests:**
    *   Verify that bid commitments are generated correctly.
    *   Verify that `evaluate_highest_bidder` correctly resolves the winner.
    *   Assert that losers can reclaim their escrowed funds privately.

---

## 5. How to Build & Deploy on Midnight
To build this project without errors, refer to the master build guide located at the root of the workspace: [BUILD_GUIDE.md](file:///Users/neelsubhashpote/moonlight/BUILD_GUIDE.md). It details how to:
1. Fix language pragma version mismatches.
2. Resolve SDK `4.x` dependency issues.
3. Start the Docker-based local ZK proof server.
4. Deploy the contract using a custom `deploy.mjs` script.
5. Prevent DUST gas errors.
