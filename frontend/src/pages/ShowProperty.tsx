// ShowProperty.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const styles = {
  card: {
    border: "1px solid #ddd",
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    background: "#fff",
  },
  imageRow: { display: "flex", gap: 10, marginTop: 10 },
  image: { width: 100, height: 100, objectFit: "cover", borderRadius: 4 },
  buyBtn: {
    padding: "8px 12px",
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  reviewBox: {
    marginTop: 15,
    padding: 10,
    border: "1px solid #ccc",
    borderRadius: 5,
  },
  reviewItem: { marginBottom: 10 },
  input: { width: "100%", padding: 8, marginBottom: 10 },
  textarea: { width: "100%", padding: 8, marginBottom: 10 },
  submitBtn: {
    padding: "8px 12px",
    background: "#3498db",
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
  buyer_id?: string | null;
  images?: { id: string; prop_image: string }[];
}

const ShowProperty: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const tenantId = sessionStorage.getItem("tenantId");

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [openReview, setOpenReview] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    if (!tenantId) {
      navigate("/login");
      return;
    }

    // Fetch single property by id (dummy API)
    fetch(`http://localhost:6876/api/properties/${propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        setProperty(data.property);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [propertyId, tenantId, navigate]);

  const handleBuy = (prop: Property) => {
    console.log("Buy clicked for:", prop);
    alert(`Buy clicked for ${prop.property_name}`);
  };

  const fetchReviews = async () => {
    if (!property) return;
    setOpenReview(true);
    // Dummy API call
    const res = await fetch(
      `http://localhost:6876/api/properties/reviews/get/${property.id}`,
    );
    const data = await res.json();
    setReviews(data.reviews || []);
  };

  const submitReview = async () => {
    if (!property || !reviewText.trim()) {
      alert("Review cannot be empty");
      return;
    }

    // Dummy POST request
    await fetch("http://localhost:6876/api/properties/reviews/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        property_id: property.id,
        user_id: tenantId,
        review: reviewText,
        rating,
      }),
    });

    setReviewText("");
    setRating(5);
    fetchReviews();
  };

  if (loading) return <p>Loading property...</p>;
  if (!property) return <p>Property not found</p>;

  return (
    <div>
      <h2>Property Details</h2>

      <div style={styles.card}>
        <a href={`/profile_page/${property.owner_id}`}>Owner Profile</a>
        <p>
          <b>Name:</b> {property.property_name}
        </p>
        <p>
          <b>Address:</b> {property.address}
        </p>
        <p>
          <b>Type:</b> {property.property_type}
        </p>
        <p>
          <b>Price:</b> ₹{property.prize}
        </p>
        <p>
          <b>Status:</b> {property.availability_status}
        </p>

        {/* {property.images?.length > 0 ? (
          <div style={styles.imageRow}>
            {property.images.map((img) => (
              <img
                key={img.id}
                src={img.prop_image}
                alt="property"
                style={styles.image}
              />
            ))}
          </div>
        )} */}

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {property.buyer_id == null && (
            <button onClick={() => handleBuy(property)} style={styles.buyBtn}>
              Buy
            </button>
          )}

          <button onClick={fetchReviews}>Reviews</button>
        </div>

        {openReview && (
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
            <button onClick={submitReview} style={styles.submitBtn}>
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowProperty;
