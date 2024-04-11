import { Store, connectorStore } from "../../state/store";
import {
  sendCoins,
  sendSeveralAssets,
  singleDelegation,
  singleUndelegation,
  buildTxWithValidityInterval,
} from "../../features";
import { useEffect, useState } from "preact/hooks";

import "./wallet-actions.css";
import { ObservableWallet } from "@cardano-sdk/wallet";

export const WalletActions = () => {
  const [storeState, setStoreState] = useState<Store>(
    connectorStore.initialState
  );

  useEffect(() => {
    const subscription = connectorStore.subscribe(setStoreState);
    connectorStore.init();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!storeState.wallet) {
    return null;
  }

  const handleClick = async ({
    action,
    title,
  }: {
    action: {
      ({ connectedWallet }: { connectedWallet: ObservableWallet }): Promise<{
        hash: string;
        txId: string;
      }>;
      (arg0: { connectedWallet: ObservableWallet }):
        | PromiseLike<{ hash: any; txId: any }>
        | { hash: any; txId: any };
    };
    title: string;
  }) => {
    if (!storeState.wallet) {
      return null;
    }

    const { hash, txId } = await action({
      connectedWallet: storeState.wallet,
    });
    connectorStore.log({
      hash,
      title,
      txId,
    });
  };

  const handleValidityInterval = async ({
    options,
    title,
  }: {
    options: boolean;
    title: string;
  }) => {
    if (!storeState.wallet) {
      return null;
    }
    const { hash, txId } = await buildTxWithValidityInterval({
      connectedWallet: storeState.wallet,
      expired: options,
    });

    connectorStore.log({
      hash,
      title,
      txId,
    });
  };

  return (
    <div class="actions-container">
      <h3>Wallet actions</h3>
      <button
        class="wallet-button"
        onClick={() => handleClick({ action: sendCoins, title: "Send coins" })}
      >
        Send coins
      </button>
      <button
        class="wallet-button"
        onClick={() =>
          handleClick({
            action: sendSeveralAssets,
            title: "Send several assets",
          })
        }
      >
        Send several assets
      </button>
      <button
        class="wallet-button"
        onClick={() =>
          handleClick({ action: singleDelegation, title: "Single delegation" })
        }
      >
        Single delegation
      </button>
      <button
        class="wallet-button"
        onClick={() =>
          handleClick({
            action: singleUndelegation,
            title: "Single undelegation",
          })
        }
      >
        Single undelegation
      </button>
      <button
        class="wallet-button"
        onClick={() =>
          handleValidityInterval({
            options: true,
            title: "Tx with expired validity interval",
          })
        }
      >
        Send Tx with expired validity interval
      </button>
      <button
        class="wallet-button"
        onClick={() =>
          handleValidityInterval({
            options: false,
            title: "Tx with unlimited validity interval",
          })
        }
      >
        Send Tx with unlimited validity interval
      </button>
    </div>
  );
};
