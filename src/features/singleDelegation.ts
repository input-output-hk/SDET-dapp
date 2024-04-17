import { Cardano } from "@cardano-sdk/core";
import { firstValueFrom } from "rxjs";
import { ObservableWallet } from "@cardano-sdk/wallet";
import { inspectAndSignTx } from "../utils";

export const singleDelegation = async ({
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
    throw new Error("Your wallet has no coins");
  }

  const poolId = Cardano.PoolId.toKeyHash(
    Cardano.PoolId("pool1pzdqdxrv0k74p4q33y98f2u7vzaz95et7mjeedjcfy0jcgk754f")
  );
  const poolIdHex = Cardano.PoolIdHex(poolId);
  const portfolio = {
    name: "SMAUG",
    pools: [
      {
        id: Cardano.PoolIdHex(poolIdHex),
        weight: 1,
      },
    ],
  };

  const builder = connectedWallet.createTxBuilder();
  const builtTxDelegatingPortfolio = builder
    .delegatePortfolio(portfolio)
    .build();
  const { hash, txId } = await inspectAndSignTx({
    builtTx: builtTxDelegatingPortfolio,
    connectedWallet,
  });

  return { hash, txId };
};
