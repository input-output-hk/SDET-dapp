import { firstValueFrom } from "rxjs";
import { ObservableWallet } from "@cardano-sdk/wallet";
import { inspectAndSignTx } from "../utils";

export const sendSeveralAssets = async ({
  connectedWallet,
}: {
  connectedWallet: ObservableWallet;
}): Promise<{ hash: string; txId: string } | null> => {
  if (!connectedWallet) {
    return null;
  }

  const availableBalance = await firstValueFrom(
    connectedWallet.balance.utxo.available$
  );

  if (!availableBalance.assets || availableBalance.assets?.size === 0) {
    throw new Error("Your wallet has no assets");
  }

  let nftCount = 0;
  let tokenCount = 0;
  const assetMap = new Map();
  for (const [key, value] of availableBalance.assets) {
    if (value === 1n && nftCount < 1) {
      nftCount++;
      assetMap.set(key, value);
    } else if (value > 1n && tokenCount < 1) {
      tokenCount++;
      assetMap.set(key, 1n);
    }
  }

  if (assetMap.size < 2) throw new Error("Didn't find 1NFT and FT to send");

  const builder = connectedWallet.createTxBuilder();
  const output = await builder
    .buildOutput()
    .handle("rhys")
    .assets(assetMap)
    .coin(10_000_000n)
    .build();
  const builtTx = builder.addOutput(output).build();
  const { hash, txId } = await inspectAndSignTx({
    builtTx,
    connectedWallet,
  });

  return { hash, txId };
};
