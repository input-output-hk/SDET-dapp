import "./dashboard.css";
import { Logs, WalletActions } from "..";

export const Dashboard = () => (
  <div class="dashboard-container">
    <div>
      <WalletActions />
    </div>
    <div>
      <Logs />
    </div>
  </div>
);
