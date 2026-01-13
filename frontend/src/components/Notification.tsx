import React, { useEffect, useState } from "react";

const Notification: React.FC = () => {
  const [message, setMessage] = useState("");
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:6876/api/properties/notifications/get_all"
      );
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const createNotification = async () => {
    if (!message.trim()) {
      alert("Notification cannot be empty");
      return;
    }

    await fetch("http://localhost:6876/api/notifications/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    setMessage("");
    fetchNotifications();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🔔 Notifications</h2>

      <div style={styles.addBox}>
        <input
          type="text"
          placeholder="Enter notification..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button onClick={createNotification} style={styles.button}>
          Send
        </button>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>All Notifications</h3>

      {loading && <p>Loading...</p>}

      {!loading && notifications.length === 0 && <p>No notifications found</p>}

      <div style={styles.list}>
        {notifications.map((n) => (
          <div key={n.id} style={styles.card}>
            <p>{n.message}</p>
            <small style={styles.time}>
              {new Date(n.created_at).toLocaleString()}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;

const styles: any = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
  },
  addBox: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
  },
  button: {
    padding: "10px 20px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "15px",
  },
  card: {
    padding: "12px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    background: "#f9fafb",
  },
  time: {
    color: "#666",
    fontSize: "12px",
  },
};
