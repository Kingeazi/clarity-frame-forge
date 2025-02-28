import {
  Clarinet,
  Tx,
  Chain,
  Account,
  types
} from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

Clarinet.test({
  name: "Can mint new frame",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;

    let block = chain.mineBlock([
      Tx.contractCall(
        "frame",
        "mint-frame",
        [types.utf8("Test Frame"), types.utf8("ipfs://test")],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectOk(), "u1");
  },
});

Clarinet.test({
  name: "Can update frame metadata",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;

    // First mint a frame
    let block = chain.mineBlock([
      Tx.contractCall(
        "frame",
        "mint-frame",
        [types.utf8("Test Frame"), types.utf8("ipfs://test")],
        deployer.address
      )
    ]);

    // Then update its metadata
    block = chain.mineBlock([
      Tx.contractCall(
        "frame",
        "update-frame-metadata",
        [types.uint(1), types.utf8("Updated Frame"), types.utf8("ipfs://updated")],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});

Clarinet.test({
  name: "Can transfer frame",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get("deployer")!;
    const wallet1 = accounts.get("wallet_1")!;

    // First mint a frame
    let block = chain.mineBlock([
      Tx.contractCall(
        "frame",
        "mint-frame",
        [types.utf8("Test Frame"), types.utf8("ipfs://test")],
        deployer.address
      )
    ]);

    // Then transfer it
    block = chain.mineBlock([
      Tx.contractCall(
        "frame",
        "transfer-frame",
        [types.uint(1), types.principal(wallet1.address)],
        deployer.address
      )
    ]);

    assertEquals(block.receipts[0].result.expectOk(), true);
  },
});
