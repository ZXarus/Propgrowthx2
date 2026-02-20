import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

export default function PrivateRoute({ allowedRoles }: PrivateRouteProps) {
  const token = sessionStorage.getItem("token");
  const roleRaw = sessionStorage.getItem("role");

  // No token - redirect to auth
  if (!token) {
    return <Navigate to="/auth" replace />;
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

  console.log("PrivateRoute - Parsed Role:", role, "Allowed:", allowedRoles);

  // Check if user role is allowed
  if (allowedRoles && allowedRoles.length > 0) {
    if (!role || !allowedRoles.includes(role)) {
      console.log("Role not allowed, redirecting to /");
      return <Navigate to="/" replace />;
    }
  }

  console.log("✅ Access granted");
  return <Outlet />;
}