import { Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import ScrollToTop from "./hooks/ScrollToTop";
import PrivateRoute from "./hooks/PrivateRoute";
import PublicRoute from "./hooks/PublicRoute";
import AuthPage from "./pages/AuthPage";
import SetPassword from "./pages/SetPassword";
import Index from "./pages/Index";
import OwnerDashboard from "./pages/dashboard/owner/OwnerDashboard";
import OwnerProperties from "./pages/dashboard/owner/OwnerProperties";
import OwnerTransactions from "./pages/dashboard/owner/OwnerTransactions";
import TenantDashboard from "./pages/dashboard/tenant/TenantDashboard";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";

import Contact from "./pages/Contact";
import Services from "./pages/Services";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import TenantComplaints from "./pages/dashboard/tenant/TenantComplaints";
import TenantTransactions from "./pages/dashboard/tenant/TenantTransactions";
import OwnerComplaints from "./pages/dashboard/owner/OwnerComplaints";
import { DataProvider } from "./context/dataContext";
import PaymentsPage from "./pages/PaymentsPage";
import PropertiesPage from "./pages/property/PropertiesPage";
import AllPropertiesPage from "./pages/property/AllPropertiesPage";

function App() {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <DataProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard/owner" element={<OwnerDashboard />} />
          {/* individual payment */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          {/* Individual property*/}
          <Route path="/properties-manage" element={<PropertiesPage />} />
          <Route path="/all-properties" element={<AllPropertiesPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/owner/complaints" element={<OwnerComplaints />} />
          {/* here we show all properties */}
          <Route path="/properties" element={<Properties />} />
          {/* tenant code */}
          <Route path="/dashboard/tenant" element={<TenantDashboard />} />
          <Route
            path="/dashboard/tenant/complaints"
            element={<TenantComplaints />}
          />{" "}
          <Route
            path="/dashboard/tenant/transactions"
            element={<TenantTransactions />}
          />
          {/* not found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </DataProvider>
    </HelmetProvider>
  );
}
export default App;

//       <Route element={<PrivateRoute />}>
//         <Route path="/profile/:id" element={<Profile />} />
//         <Route path="/property/:id" element={<PropertyDetails />} />
//       </Route>
