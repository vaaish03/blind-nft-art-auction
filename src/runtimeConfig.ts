type RuntimeEnvironment = {
  networkId?: string;
  contractAddress?: string;
  faucetUrl?: string;
  demoMode?: string;
  production?: boolean;
};

export type VerifiedDeployment = {
  contractName: 'blind_auction';
  contractAddress: string;
  network: 'preview';
  transactionHash: string;
  deployedAt: string;
};

const ADDRESS = /^[0-9a-f]{64}$/i;
const TRANSACTION = /^[0-9a-f]{66}$/i;
const PREVIEW_FAUCET = 'https://faucet.preview.midnight.network/';

export function verifyGalleryDeployment(value: unknown): VerifiedDeployment {
  if (!value || typeof value !== 'object') {
    throw new Error('Blind NFT Art Auction: deployment evidence is missing.');
  }

  const candidate = value as Record<string, unknown>;
  if (candidate.contractName !== 'blind_auction') {
    throw new Error('Blind NFT Art Auction: deployment belongs to a different contract.');
  }
  if (candidate.network !== 'preview') {
    throw new Error('Blind NFT Art Auction: only the independently deployed Preview contract is accepted.');
  }
  if (typeof candidate.contractAddress !== 'string' || !ADDRESS.test(candidate.contractAddress)) {
    throw new Error('Blind NFT Art Auction: contract address is not a 32-byte hexadecimal address.');
  }
  if (typeof candidate.transactionHash !== 'string' || !TRANSACTION.test(candidate.transactionHash)) {
    throw new Error('Blind NFT Art Auction: finalized deployment transaction evidence is invalid.');
  }
  if (typeof candidate.deployedAt !== 'string' || Number.isNaN(Date.parse(candidate.deployedAt))) {
    throw new Error('Blind NFT Art Auction: deployment timestamp is invalid.');
  }

  return candidate as VerifiedDeployment;
}

export function validateGalleryDeploymentRuntime(env: RuntimeEnvironment) {
  const networkId = env.networkId || 'preview';
  const faucetUrl = env.faucetUrl || PREVIEW_FAUCET;

  if (networkId !== 'preview') {
    throw new Error('Blind NFT Art Auction: wallet network must be Preview.');
  }
  if (faucetUrl !== PREVIEW_FAUCET) {
    throw new Error('Blind NFT Art Auction: faucet host is not the approved Preview faucet.');
  }
  if (env.contractAddress && !ADDRESS.test(env.contractAddress)) {
    throw new Error('Blind NFT Art Auction: VITE_CONTRACT_ADDRESS is malformed.');
  }
  if (env.production && env.demoMode === 'true') {
    throw new Error('Blind NFT Art Auction: simulated chain activity is forbidden in production.');
  }

  return { networkId, faucetUrl, contractAddress: env.contractAddress || null };
}

