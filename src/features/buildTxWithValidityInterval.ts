import { EMPTY, catchError, take, tap } from "rxjs";
import { Cardano } from "@cardano-sdk/core";
import { logger } from "@cardano-sdk/util-dev";
import type { ObservableWallet } from "@cardano-sdk/wallet";

import { inspectAndSignTx } from "../utils";

export const buildTxWithValidityInterval = ({
  connectedWallet,
  expired,
}: {
  connectedWallet: ObservableWallet;
  expired: boolean;
}): Promise<{ hash: string; txId: string }> =>
  new Promise((resolve, reject) => {
    connectedWallet.tip$
      .pipe(
        take(1),
        tap(async (tip) => {
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

          resolve({ hash, txId });
        }),
        catchError((error) => {
          logger.error("Failed to build tx", error);
          reject(new Error("Failed to build transaction"));
          return EMPTY;
        })
      )
      .subscribe();
  });
