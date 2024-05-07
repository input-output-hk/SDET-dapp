import { firstValueFrom } from "rxjs";
import { ObservableWallet } from "@cardano-sdk/wallet";
import { inspectAndSignTx } from "../utils";

export const singleUndelegation = async ({
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

  if (availableBalance.coins === 0n) {
    throw new Error("Your wallet has no assets");
  }

  const builtTx = connectedWallet
    .createTxBuilder()
    .delegatePortfolio(null)
    .build();
  const { hash, txId } = await inspectAndSignTx({
    builtTx,
    connectedWallet,
  });

  return { hash, txId };
};
