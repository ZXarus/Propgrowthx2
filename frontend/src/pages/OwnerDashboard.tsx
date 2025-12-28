import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Logout } from "../components/Logout";
import { AllProperties } from "../components/AllProperties";
import { UploadProperty } from "../components/UploadProperty";

const OwnerDashboard: React.FC = () => {
  const [owner_id, setOwner_id] = useState<string | null>(null);
  const token = sessionStorage.getItem("token");

  const getAccess = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:6876/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unauthorized");
      }

      setOwner_id(data?.user.id);
    } catch (err) {
      console.error("Auth error", err);
    }
  };

  useEffect(() => {
    getAccess();
  }, [token]);

  const [activePage, setActivePage] = useState("Upload Property");

  if (!owner_id) return <p>Loading owner...</p>;

  return (
    <div style={styles.container}>
      <Sidebar
        items={["Upload Property", "Transactions", "All Properties", "Logout"]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "Upload Property" && (
          <UploadProperty ownerId={owner_id} />
        )}
        {/* {activePage === "Transactions" && <Transactions ownerId={owner_id} />} */}
        {activePage === "All Properties" && (
          <AllProperties ownerId={owner_id} />
        )}
        {activePage === "Logout" && <Logout />}
      </div>
    </div>
  );
};
export default OwnerDashboard;

// const Transactions: React.FC = () => {
//   return (
//     <div>
//       <h2>Transactions</h2>
//       <ul>
//         <li>Tenant A - ₹10,000</li>
//         <li>Tenant B - ₹18,000 </li>
//         <li>Tenant C - ₹25,000 </li>
//       </ul>
//     </div>
//   );
// };

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },
  main: {
    flex: 1,
    padding: "30px",
    background: "#f8fafc",
  },
  input: {
    display: "block",
    width: "300px",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    borderRadius: "6px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
  card: {
    padding: "15px",
    marginBottom: "10px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
};
