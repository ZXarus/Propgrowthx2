import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Logout } from "../components/Logout";
import { AllProperties } from "../components/AllProperties";
import { UploadProperty } from "../components/UploadProperty";

const Complaints: React.FC<{ userId: string }> = ({ userId }) => {
  return <p>complanits {userId}</p>;
};
const NotiFy: React.FC<{ userId: string }> = ({ userId }) => {
  return <p>Notify {userId}</p>;
};

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
        items={[
          "Upload Property",
          "Transactions",
          "All Properties",
          "Complaints",
          "Notification",
          "Logout",
        ]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "Upload Property" && (
          <UploadProperty ownerId={owner_id} />
        )}
        {activePage === "Transactions" && <Payments ownerId={owner_id} />}
        {activePage === "All Properties" && (
          <AllProperties ownerId={owner_id} />
        )}
        {activePage === "Logout" && <Logout />}
        {activePage === "Complaints" && <Complaints userId={owner_id} />}
        {activePage === "Notification" && <NotiFy userId={owner_id} />}
      </div>
    </div>
  );
};
export default OwnerDashboard;

const Payments: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:6876/api/payment/get/${ownerId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [ownerId]);

  if (loading) return <p>Loading payments...</p>;

  if (payments.length === 0) return <p>No payments found</p>;

  return (
    <div>
      <h2>Payments</h2>

      {payments.map((p) => (
        <div key={p.id} style={styles.card}>
          <p>
            <b>Property:</b> {p.property_name}
          </p>
          <p>
            <b>Amount:</b> ₹{p.amount}
          </p>
          <p>
            <b>Mode:</b> {p.payment_mode}
          </p>
          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color: p.status === "credited" ? "green" : "red",
              }}
            >
              {p.status}
            </span>
          </p>
          <p>
            <b>Date:</b> {new Date(p.payment_date).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

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
