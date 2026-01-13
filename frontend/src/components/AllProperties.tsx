import { useEffect, useState } from "react";

export const AllProperties: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [prop, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          `http://localhost:6876/api/properties/get_all_prop_by_owner?owner_id=${ownerId}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setProperties(data.properties || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [ownerId]);

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>❌ {error}</p>;

  return (
    <div>
      <h2>All Properties</h2>

      {prop.length === 0 && <p>No properties found</p>}

      {prop.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ccc",
            padding: 10,
            marginBottom: 10,
          }}
        >
          <p>
            <b>Property Name:</b> {p.property_name}
          </p>
          <p>
            <b>Address:</b> {p.address}
          </p>
          <p>
            <b>Property Type:</b> {p.property_type}
          </p>
          <p>
            <b>Total Area:</b> {p.total_area} sq.ft
          </p>
          <p>
            <b>Price:</b> ₹{p.prize}
          </p>

          <p>
            <b>Water Available:</b> {p.water_available ? "Yes" : "No"}
          </p>

          <p>
            <b>Electricity Available:</b>{" "}
            {p.electricity_available ? "Yes" : "No"}
          </p>

          <p>
            <b>Availability Status:</b> {p.status}
          </p>

          {p.monthly_rent && (
            <p>
              <b>Monthly Rent:</b> ₹{p.monthly_rent}
            </p>
          )}

          <p>
            <b>Created At:</b> {new Date(p.created_at).toLocaleDateString()}
          </p>

          {p.veri_image && (
            <div>
              <b>Verification Image:</b>
              <br />
              <img
                src={p.veri_image}
                alt="Verification"
                style={{ width: 150, marginTop: 5 }}
              />
            </div>
          )}

          {p.images && p.images.length > 0 && (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {p.images.map((img: any) => (
                <img
                  key={img.id}
                  src={img.prop_image}
                  alt="Property"
                  style={{ width: 150, height: 100, objectFit: "cover" }}
                />
              ))}
            </div>
          )}
          <button>edit</button>
          <button>delete</button>
        </div>
      ))}
    </div>
  );
};
