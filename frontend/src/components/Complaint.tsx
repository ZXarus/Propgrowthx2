import React, { useEffect, useState } from "react";

interface Complaint {
  id: string;
  property_id: string;
  message: string;
  status: string;
  created_at: string;
  property_name?: string;
}

interface Issue {
  id: number;
  question: string;
  answer: string;
}

const dummyIssues: Issue[] = [
  {
    id: 1,
    question: "Water supply is not available regularly",
    answer:
      "This usually happens due to local municipal issues or tank maintenance. Please contact the owner or society manager. If unresolved for 48 hours, raise a formal complaint.",
  },
  {
    id: 2,
    question: "Electricity power cuts happening frequently",
    answer:
      "Frequent power cuts may occur due to transformer overload or maintenance work. Kindly check with the local electricity board or ask the owner for backup solutions.",
  },
  {
    id: 3,
    question: "Owner not responding to calls/messages",
    answer:
      "If the owner is unresponsive, use the in-app complaint system. If there is no response within 72 hours, the issue will be escalated automatically.",
  },
  {
    id: 4,
    question: "Property images do not match real condition",
    answer:
      "Please upload recent images and raise a complaint with proof. Our verification team will review the issue and take necessary action.",
  },
  {
    id: 5,
    question: "Security deposit not returned",
    answer:
      "Security deposits must be returned within the agreed notice period. If delayed, raise a financial dispute complaint with proof of payment.",
  },
];

const ComplaintWithIssueSolver: React.FC<{
  userId: string;
  role: "tenant" | "owner";
}> = ({ userId, role }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSolver, setShowSolver] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    fetch(`http://localhost:6876/api/complain/get/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, role]);

  if (loading) return <p>Loading complaints...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Complaints</h2>

      {complaints.length === 0 && <p>No complaints found</p>}

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
            <b>Complaint:</b> {c.message}
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

      {/* ISSUE SOLVER BUTTON */}
      <button
        onClick={() => setShowSolver(true)}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
        }}
      >
        🛠 Issue Solver
      </button>

      {/* ISSUE SOLVER PANEL */}
      {showSolver && (
        <div
          style={{
            marginTop: 25,
            border: "1px solid #ddd",
            padding: 20,
            borderRadius: 8,
            background: "#f9fafb",
          }}
        >
          <h3>Common Property Issues</h3>

          {!selectedIssue &&
            dummyIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                style={{
                  padding: 12,
                  marginBottom: 10,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                ❓ {issue.question}
              </div>
            ))}

          {/* ANSWER VIEW */}
          {selectedIssue && (
            <div
              style={{
                background: "#fff",
                padding: 15,
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            >
              <h4>{selectedIssue.question}</h4>
              <p style={{ marginTop: 10 }}>{selectedIssue.answer}</p>

              <button
                onClick={() => setSelectedIssue(null)}
                style={{
                  marginTop: 15,
                  padding: "6px 14px",
                  background: "#e5e7eb",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                ← Back to Issues
              </button>
            </div>
          )}

          <button
            onClick={() => {
              setShowSolver(false);
              setSelectedIssue(null);
            }}
            style={{
              marginTop: 15,
              display: "block",
              background: "transparent",
              border: "none",
              color: "#2563eb",
              cursor: "pointer",
            }}
          >
            Close Issue Solver
          </button>
        </div>
      )}
    </div>
  );
};
``;

export default ComplaintWithIssueSolver;
