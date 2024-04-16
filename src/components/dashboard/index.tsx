import "./dashboard.css";
import { Logs, WalletActions } from "..";

export const Dashboard = () => (
  <div className="dashboard-container">
    <div>
      <WalletActions />
    </div>
    <div>
      <Logs />
    </div>
  </div>
);
