import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can create sequence",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;

    let block = chain.mineBlock([
      Tx.contractCall(
        "sequence",
        "create-sequence",
        [types.utf8("Test Sequence")],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectOk(), "u1");
  },
});

Clarinet.test({
  name: "Can add frame to sequence",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    // Add frame test implementation
  },
});
