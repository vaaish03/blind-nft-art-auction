# Verification checklist

The executable contract suite is `src/test/blind.test.ts`.

```bash
npm test
npm run compile
npm run build
```

Six passing scenarios cover auction initialization, private bid commitments, the reveal transition, a valid highest-bid update, commitment mismatch rejection, and late-commitment rejection. The tests verify that artwork bids remain hidden until the auction permits disclosure.

CI runs the contract and frontend verification jobs on every push and pull request.
