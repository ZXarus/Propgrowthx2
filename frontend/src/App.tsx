import { Route, Routes } from "react-router-dom";
import TenantDashboard from "./pages/tenant/TenantDashboard";
import AuthPage from "./pages/AuthPage";
import DashboardOwner from './pages/owner/DashboardLayout'
function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard_owner" element={<DashboardOwner />} />
      <Route path="/dashboard_tenant" element={<TenantDashboard />} />
    </Routes>
  );
}
export default App;
