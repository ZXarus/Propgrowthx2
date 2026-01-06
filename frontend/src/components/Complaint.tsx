import React, { useEffect, useState } from "react";

interface Complaint {
  id: string;
  property_id: string;
  complaint: string;
  status: string;
  created_at: string;
  property_name?: string;
}

const Complaint: React.FC<{
  userId: string;
  role: "tenant" | "owner";
}> = ({ userId, role }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:6876/api/complaint/get/${role}/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, role]);

  if (loading) return <p>Loading complaints...</p>;

  if (complaints.length === 0) return <p>No complaints found</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Complaints</h2>

      {complaints.map((c) => (
        <div
          key={c.id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 15,
            borderRadius: 6,
            background: "#fff",
          }}
        >
          <p>
            <b>Property:</b> {c.property_name || c.property_id}
          </p>

          <p>
            <b>Complaint:</b> {c.complaint}
          </p>

          <p>
            <b>Status:</b>{" "}
            <span
              style={{
                color: c.status === "resolved" ? "green" : "red",
                fontWeight: 600,
              }}
            >
              {c.status}
            </span>
          </p>

          <p style={{ fontSize: 12, color: "#666" }}>
            {new Date(c.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Complaint;
