import { Store, connectorStore } from "../../state/store";
import {
  sendCoins,
  sendSeveralAssets,
  singleDelegation,
  singleUndelegation,
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

  const handleClick = async (
    action: {
      ({ connectedWallet }: { connectedWallet: ObservableWallet }): Promise<{
        hash: string;
        txId: string;
      }>;
      (arg0: { connectedWallet: ObservableWallet }):
        | PromiseLike<{ hash: any; txId: any }>
        | { hash: any; txId: any };
    },
    title: string
  ) => {
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

  return (
    <div class="actions-container">
      <h3>Wallet actions</h3>
      <button
        class="wallet-button"
        onClick={() => handleClick(sendCoins, "Send coins")}
      >
        Send coins
      </button>
      <button
        class="wallet-button"
        onClick={() => handleClick(sendSeveralAssets, "Send several assets")}
      >
        Send several assets
      </button>
      <button
        class="wallet-button"
        onClick={() => handleClick(singleDelegation, "Single delegation")}
      >
        Single delegation
      </button>
      <button
        class="wallet-button"
        onClick={() => handleClick(singleUndelegation, "Single undelegation")}
      >
        Single undelegation
      </button>
    </div>
  );
};
