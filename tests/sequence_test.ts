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
    const deployer = accounts.get("deployer")!;
    
    // First create a sequence
    let block = chain.mineBlock([
      Tx.contractCall(
        "sequence",
        "create-sequence",
        [types.utf8("Test Sequence")],
        deployer.address
      )
    ]);

    // Then add a frame
    block = chain.mineBlock([
      Tx.contractCall(
        "sequence",
        "add-frame",
        [types.uint(1), types.uint(1)],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectOk(), true);
    
    // Try adding same frame again - should fail
    block = chain.mineBlock([
      Tx.contractCall(
        "sequence",
        "add-frame", 
        [types.uint(1), types.uint(1)],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectErr(), "u104");
  },
});
