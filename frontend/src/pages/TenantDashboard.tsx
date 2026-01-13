import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { Logout } from "../components/Logout";
import ProfilePage from "./ProfilePage";
import ComplaintWithIssueSolver from "../components/Complaint";
const TenantDashboard: React.FC = () => {
  const [activePage, setActivePage] = useState("My Property");
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const token = sessionStorage.getItem("token");

  const getAccess = async () => {
    if (!token) return;

    try {
      const res = await fetch("http://localhost:6876/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error("Unauthorized");

      setUserId(data.user.id);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAccess();
  }, [token]);

  if (!userId) return <p>Loading...</p>;

  return (
    <div style={styles.container}>
      <Sidebar
        items={[
          "My Property",
          "All Property",
          "Profile",
          "Payments",
          "Complaints",
          "Notification",
          "Logout",
        ]}
        onSelect={setActivePage}
      />

      <div style={styles.main}>
        {activePage === "All Property" && (
          <AllProperties
            userId={userId}
            onBuy={(prop) => {
              setSelectedProperty(prop);
              setActivePage("Payment");
            }}
          />
        )}

        {activePage === "Payment" && selectedProperty && (
          <PaymentCard
            userId={userId}
            property={selectedProperty}
            onCancel={() => setActivePage("All Property")}
          />
        )}

        {activePage === "My Property" && <MyProperties userId={userId} />}

        {activePage === "Payments" && <Payments userId={userId} />}
        {activePage === "Complaints" && (
          <ComplaintWithIssueSolver userId={userId} role="tenant" />
        )}
        {activePage === "Notification" && <NotiFy userId={userId} />}
        {activePage === "Profile" && <ProfilePage />}

        {activePage === "Logout" && <Logout />}
      </div>
    </div>
  );
};

export default TenantDashboard;

const AllProperties: React.FC<{
  userId: string;
  onBuy: (property: any) => void;
}> = ({ userId, onBuy }) => {
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [openReviewProp, setOpenReviewProp] = useState<string | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetch("http://localhost:6876/api/properties/get_all")
      .then((res) => res.json())
      .then((data) => {
        setProps(data.properties || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const fetchReviews = async (propertyId: string) => {
    setOpenReviewProp(propertyId);

    const res = await fetch(
      `http://localhost:6876/api/properties/reviews/get/${propertyId}`
    );
    const data = await res.json();

    setReviews(data.reviews || []);
  };

  const submitReview = async (propertyId: string) => {
    if (!reviewText.trim()) {
      alert("Review cannot be empty");
      return;
    }

    await fetch("http://localhost:6876/api/properties/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: propertyId,
        user_id: userId,
        review: reviewText,
        rating,
      }),
    });

    setReviewText("");
    setRating(5);
    fetchReviews(propertyId);
  };

  if (loading) return <p>Loading properties...</p>;

  return (
    <div>
      <h2>All Properties</h2>

      {props.map((p) => (
        <div key={p.id} style={styles.card}>
          <p>
            <b>Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Type:</b> {p.property_type}
          </p>
          <p>
            <b>Price:</b> ₹{p.prize}
          </p>
          <p>
            <b>Status:</b> {p.availability_status}
          </p>

          {p.images?.length > 0 && (
            <div style={styles.imageRow}>
              {p.images.map((img: any) => (
                <img
                  key={img.id}
                  src={img.prop_image}
                  alt="property"
                  style={styles.image}
                />
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {p.buyer_id == null && (
              <button onClick={() => onBuy(p)} style={styles.buyBtn}>
                Buy
              </button>
            )}

            <button onClick={() => fetchReviews(p.id)} style={styles.reviewBtn}>
              Reviews
            </button>
          </div>

          {/* ================= REVIEWS SECTION ================= */}
          {openReviewProp === p.id && (
            <div style={styles.reviewBox}>
              <h4>Reviews</h4>

              {reviews.length === 0 && <p>No reviews yet</p>}

              {reviews.map((r) => (
                <div key={r.id} style={styles.reviewItem}>
                  <p>⭐ {r.rating}/5</p>
                  <p>{r.review}</p>
                </div>
              ))}

              <hr />

              <h4>Add Review</h4>

              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                style={styles.input}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} Star
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Write your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                style={styles.textarea}
              />

              <button
                onClick={() => submitReview(p.id)}
                style={styles.submitBtn}
              >
                Submit Review
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const PaymentCard: React.FC<{
  userId: string;
  property: any;
  onCancel: () => void;
}> = ({ userId, property, onCancel }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [paymentMode, setPaymentMode] = useState("online");

  const maxPrice = Number(property.price);

  const handlePay = async () => {
    const payAmount = Number(amount);

    if (!payAmount || payAmount <= 0) {
      setError("Enter valid amount");
      return;
    }

    if (payAmount > maxPrice) {
      setError("Amount cannot exceed property price");
      return;
    }

    setError("");

    const payload = {
      property_id: property.id,
      amount: payAmount,
      payment_mode: paymentMode,
      buyer_id: userId,
    };
    console.log(payload);

    // return 0;

    try {
      const res = await fetch("http://localhost:6876/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Payment failed");
        console.log(data.error);

        return;
      }

      alert(data.message || "Payment successful");
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div style={styles.paymentWrapper}>
      <div style={styles.paymentCard}>
        <h2>Payment</h2>

        <p>
          <b>Property:</b> {property.property_name}
        </p>
        <p>
          <b>Max Price:</b> ₹{property.price}
        </p>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={styles.input}
        />

        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          style={styles.input}
        >
          <option value="online">Online</option>
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
        </select>

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.row}>
          <button onClick={handlePay} style={styles.payBtn}>
            Pay
          </button>
          <button onClick={onCancel} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const MyProperties: React.FC<{ userId: string }> = ({ userId }) => {
  const [props, setProps] = useState<any[]>([]);

  const [openComplaintProp, setOpenComplaintProp] = useState<string | null>(
    null
  );
  const [complaintText, setComplaintText] = useState("");

  useEffect(() => {
    fetch(
      `http://localhost:6876/api/properties/get_all_prop_by_buyer?buyer_id=${userId}`
    )
      .then((res) => res.json())
      .then((data) => setProps(data.properties || []));
  }, [userId]);

  const submitComplaint = async (propertyId: string) => {
    if (!complaintText.trim()) {
      alert("Complaint cannot be empty");
      return;
    }

    try {
      await fetch("http://localhost:6876/api/complain/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          tenant_id: userId,
          message: complaintText,
        }),
      });

      alert("Complaint submitted");
      setComplaintText("");
      setOpenComplaintProp(null);
    } catch {
      alert("Failed to submit complaint");
    }
  };

  if (props.length === 0) return <p>No properties assigned</p>;

  return (
    <div>
      <h2>My Properties</h2>

      {props.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 15,
            marginBottom: 20,
          }}
        >
          <p>
            <b>Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Type:</b> {p.property_type}
          </p>
          <p>
            <b>Price:</b> ₹{p.prize}
          </p>
          <p>
            <b>Status:</b> {p.availability_status}
          </p>

          {p.images?.length > 0 && (
            <div>
              {p.images.map((img: any) => (
                <img
                  key={img.id}
                  src={img.prop_image}
                  alt="property"
                  style={{ width: 120, marginRight: 10 }}
                />
              ))}
            </div>
          )}

          {/* ================= COMPLAINT ================= */}
          <button
            onClick={() =>
              setOpenComplaintProp(openComplaintProp === p.id ? null : p.id)
            }
            style={{
              marginTop: 10,
              background: "#ff4d4d",
              color: "#fff",
              padding: "6px 12px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Raise Complaint
          </button>

          {openComplaintProp === p.id && (
            <div style={{ marginTop: 10 }}>
              <textarea
                placeholder="Write your complaint..."
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                style={{
                  width: "100%",
                  height: 80,
                  padding: 8,
                }}
              />

              <button
                onClick={() => submitComplaint(p.id)}
                style={{
                  marginTop: 8,
                  background: "#333",
                  color: "#fff",
                  padding: "6px 12px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Submit Complaint
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const Payments: React.FC<{ userId: string }> = ({ userId }) => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:6876/api/payment/get/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPayments(data.payments || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

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
const Complaints: React.FC<{ userId: string }> = ({ userId }) => {
  return <p>complanits {userId}</p>;
};
const NotiFy: React.FC<{ userId: string }> = ({ userId }) => {
  return <p>Notify {userId}</p>;
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { display: "flex" },
  main: { flex: 1, padding: 30, background: "#f1f5f9" },

  card: {
    background: "#fff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },

  imageRow: { display: "flex", gap: 10 },
  image: { width: 100, height: 70, objectFit: "cover" },

  buyBtn: {
    marginTop: 10,
    padding: "8px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },

  paymentWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
  },

  paymentCard: {
    width: 350,
    padding: 20,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },

  input: {
    width: "100%",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
  },

  row: { display: "flex", gap: 10 },

  payBtn: {
    flex: 1,
    background: "#16a34a",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 5,
  },

  cancelBtn: {
    flex: 1,
    background: "#dc2626",
    color: "#fff",
    padding: 10,
    border: "none",
    borderRadius: 5,
  },

  error: { color: "red" },
};
