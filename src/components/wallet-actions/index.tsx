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

  const handleSendCoins = async () => {
    if (!storeState.wallet) {
      return null;
    }

    const { hash, txId } = await sendCoins({
      connectedWallet: storeState.wallet,
    });

    connectorStore.log({
      hash,
      title: "Send coins",
      txId,
    });
  };

  const handleSendSeveralAssets = async () => {
    if (!storeState.wallet) {
      return null;
    }

    const result = await sendSeveralAssets({
      connectedWallet: storeState.wallet,
    });
    if (result) {
      const { hash, txId } = result;
      connectorStore.log({
        hash,
        title: "Send several assets",
        txId,
      });
    }
  };

  const handleSingleDelegation = async () => {
    if (!storeState.wallet) {
      return null;
    }

    const result = await singleDelegation({
      connectedWallet: storeState.wallet,
    });

    if (result) {
      const { hash, txId } = result;
      connectorStore.log({
        hash,
        title: "Single delegation",
        txId,
      });
    }
  };

  const handleSingleUndelegation = async () => {
    if (!storeState.wallet) {
      return null;
    }

    const result = await singleUndelegation({
      connectedWallet: storeState.wallet,
    });

    if (result) {
      const { hash, txId } = result;
      connectorStore.log({
        hash,
        title: "Single undelegation",
        txId,
      });
    }
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
    <div className="actions-container">
      <h3>Wallet actions</h3>
      <button className="wallet-button" onClick={handleSendCoins}>
        Send coins
      </button>
      <button className="wallet-button" onClick={handleSendSeveralAssets}>
        Send several assets
      </button>
      <button className="wallet-button" onClick={handleSingleDelegation}>
        Single delegation
      </button>
      <button className="wallet-button" onClick={handleSingleUndelegation}>
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
