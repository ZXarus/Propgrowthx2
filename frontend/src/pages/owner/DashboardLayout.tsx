import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import UploadProperty from "./upload-property";
import Logout from "./logout";
import OwnerProperties from "./owner-properties";
import DashboardHome from "./DashboardHome";

const OwnerDashboard: React.FC = () => {
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    sold: 0,
    rented: 0,
  });

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    const getAccess = async () => {
      if (!token) return;

      const res = await fetch("http://localhost:6876/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setOwnerId(data.user.id);
    };

    getAccess();
  }, [token]);

  useEffect(() => {
    if (!ownerId) return;

    const fetchStats = async () => {
      const res = await fetch(
        `http://localhost:6876/api/properties/owner-stats?owner_id=${ownerId}`
      );
      const data = await res.json();
      if (res.ok) setStats(data);
    };

    fetchStats();
  }, [ownerId]);

  if (!ownerId) return <p className="p-6">Loading dashboard...</p>;

  return (
    <div className="flex min-h-screen">
      <Sidebar
        items={[
          "Dashboard",
          "Upload Property",
          "All Properties",
          "Logout",
        ]}
        onSelect={setActivePage}
      />

      <div className="flex-1 p-8 bg-slate-50">
        {activePage === "Dashboard" && <DashboardHome stats={stats} />}
        {activePage === "Upload Property" && (
          <UploadProperty ownerId={ownerId} />
        )}
        {activePage === "All Properties" && (
          <OwnerProperties ownerId={ownerId} />
        )}
        {activePage === "Logout" && <Logout />}
      </div>
    </div>
  );
};

export default OwnerDashboard;
