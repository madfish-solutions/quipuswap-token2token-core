import { Context } from "./contracManagers/context";
import { strictEqual, ok, notStrictEqual, rejects } from "assert";
import BigNumber from "bignumber.js";
import { TezosOperationError } from "@taquito/taquito";

describe("InvestLiquidity()", function () {
  it("should invest liquidity and distribute new shares by current provider", async function () {
    this.timeout(5000000);
    // create context with exchange
    let context = await Context.init();

    let tezAmount = 1000;
    let tokenAmount = 100000;
    let newShares = 100;

    // store prev balances
    let pairAddress = context.pairs[0].contract.address;
    let aliceAddress = await context.tezos.signer.publicKeyHash();
    let aliceInitTezBalance = await context.tezos.tz.getBalance(aliceAddress);
    await context.tokens[0].updateStorage({ ledger: [aliceAddress] });
    let aliceInitTokenBalance = await context.tokens[0].storage.ledger[
      aliceAddress
    ].balance;

    // invest liquidity
    await context.pairs[0].investLiquidity(tokenAmount, tezAmount, newShares);

    // checks
    let aliceFinalTezBalance = await context.tezos.tz.getBalance(aliceAddress);
    await context.tokens[0].updateStorage({
      ledger: [aliceAddress, pairAddress],
    });
    let aliceFinalTokenBalance = await context.tokens[0].storage.ledger[
      aliceAddress
    ].balance;

    let pairTokenBalance = await context.tokens[0].storage.ledger[pairAddress]
      .balance;
    let pairTezBalance = await context.tezos.tz.getBalance(pairAddress);

    // 1. tokens/tez withdrawn
    strictEqual(
      aliceInitTokenBalance.toNumber() - tokenAmount,
      aliceFinalTokenBalance.toNumber(),
      "Tokens not sent"
    );
    ok(
      aliceInitTezBalance.toNumber() - tezAmount >=
        aliceFinalTezBalance.toNumber(),
      "Tez not sent"
    );

    // 2. tokens/tez send to token pair
    strictEqual(
      pairTokenBalance.toNumber(),
      1000000 + tokenAmount,
      "Tokens not received"
    );
    strictEqual(
      pairTezBalance.toNumber(),
      10000 + tezAmount,
      "Tez not received"
    );

    // 3. new pair state
    await context.pairs[0].updateStorage({ ledger: [aliceAddress] });
    strictEqual(
      context.pairs[0].storage.ledger[aliceAddress].balance.toNumber(),
      1000 + newShares,
      "Alice should receive 1000 shares"
    );
    strictEqual(
      context.pairs[0].storage.totalSupply.toNumber(),
      1000 + newShares,
      "Alice tokens should be all supply"
    );
    strictEqual(
      context.pairs[0].storage.tezPool.toNumber(),
      10000 + tezAmount,
      "Tez pool should be fully funded by sent amount"
    );
    strictEqual(
      context.pairs[0].storage.tokenPool.toNumber(),
      1000000 + tokenAmount,
      "Token pool should be fully funded by sent amount"
    );
    strictEqual(
      context.pairs[0].storage.invariant.toNumber(),
      (1000000 + tokenAmount) * (10000 + tezAmount),
      "Inveriant should be calculated properly"
    );
  });

  it("should invest liquidity and destribute new shares by new provider", async function () {
    this.timeout(5000000);
    // create context with exchange
    let context = await Context.init();

    let tezAmount = 1000;
    let tokenAmount = 100000;
    let newShares = 100;

    let pairAddress = context.pairs[0].contract.address;
    let aliceAddress = await context.tezos.signer.publicKeyHash();

    // update keys
    await context.updateActor("../../fixtures/key1");
    let bobAddress = await context.tezos.signer.publicKeyHash();
    await context.updateActor();

    // send tokens to bob
    await context.tokens[0].transfer(aliceAddress, bobAddress, tokenAmount);
    await context.updateActor("../../fixtures/key1");

    // store prev balances
    let bobInitTezBalance = await context.tezos.tz.getBalance(bobAddress);
    await context.tokens[0].updateStorage({ ledger: [bobAddress] });
    let bobInitTokenBalance = await context.tokens[0].storage.ledger[bobAddress]
      .balance;
    // invest liquidity
    await context.pairs[0].investLiquidity(tokenAmount, tezAmount, newShares);

    // checks
    let bobFinalTezBalance = await context.tezos.tz.getBalance(bobAddress);
    await context.tokens[0].updateStorage({
      ledger: [bobAddress, pairAddress],
    });
    let bobFinalTokenBalance = await context.tokens[0].storage.ledger[
      bobAddress
    ].balance;

    let pairTokenBalance = await context.tokens[0].storage.ledger[pairAddress]
      .balance;
    let pairTezBalance = await context.tezos.tz.getBalance(pairAddress);

    // 1. tokens/tez withdrawn
    strictEqual(
      bobInitTokenBalance.toNumber() - tokenAmount,
      bobFinalTokenBalance.toNumber(),
      "Tokens not sent"
    );
    ok(
      bobInitTezBalance.toNumber() - tezAmount >= bobFinalTezBalance.toNumber(),
      "Tez not sent"
    );

    // 2. tokens/tez send to token pair
    strictEqual(
      pairTokenBalance.toNumber(),
      1000000 + tokenAmount,
      "Tokens not received"
    );
    strictEqual(
      pairTezBalance.toNumber(),
      10000 + tezAmount,
      "Tez not received"
    );

    // 3. new pair state
    await context.pairs[0].updateStorage({ ledger: [bobAddress] });
    strictEqual(
      context.pairs[0].storage.ledger[bobAddress].balance.toNumber(),
      newShares,
      "Alice should receive 1000 shares"
    );
    strictEqual(
      context.pairs[0].storage.totalSupply.toNumber(),
      1000 + newShares,
      "Alice tokens should be all supply"
    );
    strictEqual(
      context.pairs[0].storage.tezPool.toNumber(),
      10000 + tezAmount,
      "Tez pool should be fully funded by sent amount"
    );
    strictEqual(
      context.pairs[0].storage.tokenPool.toNumber(),
      1000000 + tokenAmount,
      "Token pool should be fully funded by sent amount"
    );
    strictEqual(
      context.pairs[0].storage.invariant.toNumber(),
      (1000000 + tokenAmount) * (10000 + tezAmount),
      "Inveriant should be calculated properly"
    );
  });

  it("should fail investment if min shares are too low", async function () {
    // create context without exchanges
  });

  it("should fail investment if min shares are too high", async function () {
    // create context without exchanges
  });

  it("should fail investment if too little tez are sent", async function () {
    // create context without exchanges
  });

  it("should fail investment if too little tokens are sent", async function () {
    // create context without exchanges
  });
});
