import fs from 'node:fs';
import assert from 'node:assert/strict';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { contractName, makePlan } from './demo-plan.mjs';

export function assertExpired(updatedAt, now = Date.now()) {
  assert(Number.isFinite(updatedAt) && now - updatedAt > 2 * 60 * 60 * 1000, 'Journal is not beyond the one-hour SDK expiry plus one-hour margin');
}

if (process.env.EXPIRED_TRANSACTION_ID) {
  const file = new URL('../.nightforge/preprod-test/confirmed-demo-batch.json', import.meta.url);
  const updatedAt = fs.statSync(file).mtimeMs;
  assertExpired(updatedAt);
  const journal = JSON.parse(fs.readFileSync(file, 'utf8'));
  assert.equal(journal.network, 'preprod');
  const entries = [journal.deployment, ...journal.calls];
  const entry = entries.find(e => e.status === 'submitted' && e.identifiers?.includes(process.env.EXPIRED_TRANSACTION_ID));
  assert(entry, 'Exact unresolved transaction not found');
  const http = 'https://indexer.preprod.midnight.network/api/v4/graphql';
  for (const identifier of entry.identifiers) {
    const response = await fetch(http, { method:'POST', headers:{'content-type':'application/json'},
      body:JSON.stringify({query:'query($offset:TransactionOffset!){transactions(offset:$offset){hash}}',variables:{offset:{identifier}}}),
      signal:AbortSignal.timeout(20000) });
    assert(response.ok, 'Indexer unavailable');
    const result = await response.json();
    assert(!result.errors && Array.isArray(result.data?.transactions) && result.data.transactions.length === 0, 'Transaction exists or query failed');
  }
  const provider = indexerPublicDataProvider(http, 'wss://indexer.preprod.midnight.network/api/v4/graphql/ws');
  const chain = await provider.queryContractState(journal.deployment.contractAddress);
  if (entry === journal.deployment) assert(!chain, 'Deployment already exists');
  else {
    const module = await import('../contracts/managed/' + contractName + '/contract/index.js');
    const step = makePlan(module.pureCircuits, journal).steps[journal.calls.indexOf(entry)];
    assert(chain && !step.verify(module.ledger(chain.data)), 'Call outcome exists; refusing retry');
  }
  entry.expiredAttempts = [...(entry.expiredAttempts ?? []), {identifiers:entry.identifiers,contractAddress:entry.contractAddress,journalUpdatedAt:new Date(updatedAt).toISOString(),checkedAt:new Date().toISOString()}];
  delete entry.identifiers; delete entry.submittedId; delete entry.status;
  if (entry === journal.deployment) delete entry.contractAddress;
  fs.writeFileSync(new URL(file.href + '.tmp'), JSON.stringify(journal), {mode:0o600});
  fs.renameSync(new URL(file.href + '.tmp'), file);
  console.log(JSON.stringify({contractName,reconciledExpiredSubmission:true}));
}
