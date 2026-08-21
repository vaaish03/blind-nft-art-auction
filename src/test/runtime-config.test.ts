import { describe, expect, it } from 'vitest';
import { verifyGalleryDeployment, validateGalleryDeploymentRuntime } from '../runtimeConfig';

const deployment = {
  contractName: 'blind_auction',
  contractAddress: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  network: 'preview',
  transactionHash: '000000000000000000000000000000000000000000000000000000000000000000',
  deployedAt: '2026-08-03T18:00:00.000Z',
};

describe('Blind NFT Art Auction production configuration', () => {
  it('accepts matching Preview deployment evidence', () => {
    expect(verifyGalleryDeployment(deployment).contractName).toBe('blind_auction');
  });

  it('rejects evidence copied from another project', () => {
    expect(() => verifyGalleryDeployment({ ...deployment, contractName: 'foreign_contract' })).toThrow(/different contract/);
  });

  it('rejects malformed contract and transaction identifiers', () => {
    expect(() => verifyGalleryDeployment({ ...deployment, contractAddress: 'preview1bad' })).toThrow(/32-byte/);
    expect(() => verifyGalleryDeployment({ ...deployment, transactionHash: 'pending' })).toThrow(/transaction evidence/);
  });

  it('prevents demo mode and network drift in production', () => {
    expect(() => validateGalleryDeploymentRuntime({ networkId: 'preprod' })).toThrow(/Preview/);
    expect(() => validateGalleryDeploymentRuntime({ production: true, demoMode: 'true' })).toThrow(/forbidden/);
  });
});

