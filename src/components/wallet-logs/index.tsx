import { Store, connectorStore } from "../../state/store";
import { useEffect, useState } from "preact/hooks";

import "./logs.css";

export const Logs = () => {
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

  const getAddresses = () =>
    storeState.addresses?.map((a) => <p>{a.address}</p>);

  return (
    <div class="logs-container">
      <h3>Logs</h3>
      {storeState.addresses && storeState.balance ? (
        <div class="logs-container-summary">
          <h4>Balance: </h4>
          <p> {storeState?.balance?.coins / 1_000_000n} tADA</p>
          <h4>Addresses: </h4> {getAddresses()}
        </div>
      ) : (
        <p class="logs-container-summary">Loading wallet details</p>
      )}

      <div class="logs-container-summary">
        {storeState.log.map((entry) => (
          <>
            <h4>{entry.title}</h4>
            <h5>Hash:</h5>
            {entry.hash}
            <h5>Transaction ID:</h5> {entry.txId}
          </>
        ))}
      </div>
    </div>
  );
};
