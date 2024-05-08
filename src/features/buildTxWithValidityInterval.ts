import { firstValueFrom } from "rxjs";
import { Cardano } from "@cardano-sdk/core";
import type { ObservableWallet } from "@cardano-sdk/wallet";

import { inspectAndSignTx } from "../utils";

export const buildTxWithValidityInterval = async ({
  connectedWallet,
  expired,
}: {
  connectedWallet: ObservableWallet;
  expired: boolean;
}): Promise<{ hash: string; txId: string } | null> => {
  if (!connectedWallet) {
    return null;
  }

  const tip = await firstValueFrom(connectedWallet.tip$);

  const expiredValidityInterval: Cardano.ValidityInterval = {
    invalidHereafter: Cardano.Slot(tip.blockNo),
  };

  const noLimitValidityInterval: Cardano.ValidityInterval = {
    invalidHereafter: undefined,
  };

  const builder = connectedWallet.createTxBuilder();
  const builtTx = builder.addOutput(
    await builder.buildOutput().handle("rhys").coin(10_000_000n).build()
  );
  const expiredValidityIntervalTx = builtTx
    .setValidityInterval(
      expired ? expiredValidityInterval : noLimitValidityInterval
    )
    .build();

  const { hash, txId } = await inspectAndSignTx({
    builtTx: expiredValidityIntervalTx,
    connectedWallet,
  });

  return { hash, txId };
};
