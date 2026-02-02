// ShowProperty.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// minimal page styles
const pageStyles = {
  container: {
    maxWidth: 800,
    margin: "20px auto",
    padding: 20,
    background: "#f7f9fb",
    borderRadius: 10,
  },
  mainHeading: { textAlign: "center", marginBottom: 20 },
};

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 20,
    background: "#fff",
    marginBottom: 20,
  },
  titleBar: {
    background: "#3498db",
    color: "white",
    padding: "10px 15px",
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 20,
  },
  buyBtn: {
    padding: "8px 12px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
};

interface Property {
  id: string;
  owner_id: string;
  property_name: string;
  address: string;
  property_type: string;
  prize: number;
  availability_status: string;
}

// Minimal Auth Component inside same page
const AuthForm: React.FC<{ onLoginSuccess: () => void }> = ({
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("tenant");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:6876/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      sessionStorage.setItem("token", data.token);
      onLoginSuccess(); // notify parent page
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "50px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2 style={{ textAlign: "center" }}>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <input
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="tenant">Tenant</option>
          <option value="owner">Owner</option>
        </select>
        <button
          style={{
            width: "100%",
            padding: 10,
            background: "#3498db",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

// Main Page
const ShowProperty: React.FC = () => {
  const { property_Id } = useParams<{ property_Id: string }>();
  const token = sessionStorage.getItem("token");
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handlebuy = async () => {
    fetch(`http://localhost:6876/api/properties/buy/${property_Id}`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.property);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!isLoggedIn) return; // fetch property only after login
    fetch(`http://localhost:6876/api/properties/getById/${property_Id}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.property);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [property_Id, isLoggedIn]);

  if (!isLoggedIn) {
    return <AuthForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading property...</p>;
  if (!property)
    return <p style={{ textAlign: "center" }}>Property not found</p>;

  return (
    <div style={pageStyles.container}>
      <h1>🏡 Property Information</h1>

      <div style={styles.card}>
        <div style={styles.titleBar}>{property.property_name}</div>
        <a href={`/profile_page/${property.owner_id}`}>View Owner Profile</a>
        <p>
          <b>Address:</b> {property.address}
        </p>
        <p>
          <b>Property Type:</b> {property.property_type}
        </p>
        <p>
          <b>Price:</b> ₹{property.prize}
        </p>
        <p>
          <b>Status:</b> {property.availability_status}
        </p>
        <button style={styles.buyBtn} onClick={handlebuy}>
          Buy Property
        </button>
      </div>
    </div>
  );
};

export default ShowProperty;
