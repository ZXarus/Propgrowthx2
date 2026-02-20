import { Navigate, Outlet } from "react-router-dom";

export default function PublicRoute() {
  const token = sessionStorage.getItem("token");
  const roleRaw = sessionStorage.getItem("role");

  if (!token) {
    return <Outlet />;
  }

  // Parse role - it's stored as JSON {"role":"tenant"}
  let role = null;
  if (roleRaw) {
    try {
      const parsed = JSON.parse(roleRaw);
      role = parsed.role;
    } catch (e) {
      role = roleRaw; // Fallback if it's already a string
    }
  }

  console.log("PublicRoute - Already logged in with role:", role);

  // If logged in, redirect to appropriate dashboard
  if (role === "tenant") {
    return <Navigate to="/dashboard/tenant" replace />;
  } else if (role === "owner") {
    return <Navigate to="/dashboard-nav" replace />;
  }

  // Fallback
  return <Navigate to="/" replace />;
}