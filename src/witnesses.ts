import { Ledger } from "../contracts/managed/blind_auction/contract/index.js";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";

export type BlindPrivateState = {
  readonly secretKey: Uint8Array;
  readonly bidAmount: bigint;
  readonly bidSalt: Uint8Array;
};

export const createBlindPrivateState = (secretKey: Uint8Array, bidAmount: bigint, bidSalt: Uint8Array) => ({
  secretKey,
  bidAmount,
  bidSalt
});

export const witnesses = {
  localSecretKey: ({
    privateState,
  }: WitnessContext<Ledger, BlindPrivateState>): [
    BlindPrivateState,
    Uint8Array,
  ] => [privateState, privateState.secretKey],

  bidAmount: ({
    privateState,
  }: WitnessContext<Ledger, BlindPrivateState>): [
    BlindPrivateState,
    bigint,
  ] => [privateState, privateState.bidAmount],

  bidSalt: ({
    privateState,
  }: WitnessContext<Ledger, BlindPrivateState>): [
    BlindPrivateState,
    Uint8Array,
  ] => [privateState, privateState.bidSalt],
};
