import { Route, Routes } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import OwnerDashboard from "./pages/OwnerDashboard";
import TenantDashboard from "./pages/TenantDashboard";

import Profile from "./pages/Profile";
function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/dashboard_owner" element={<OwnerDashboard />} />
      <Route path="/dashboard_tenant" element={<TenantDashboard />} />
      <Route path="/profile_page/:profileId" element={<Profile />} />
    </Routes>
  );
}
export default App;
