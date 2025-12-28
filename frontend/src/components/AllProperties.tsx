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
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
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
            <b>Availability Status:</b> {p.availability_status}
          </p>

          {p.monthly_rent && (
            <p>
              <b>Monthly Rent:</b> ₹{p.monthly_rent}
            </p>
          )}

          <p>
            <b>Created At:</b> {new Date(p.created_at).toLocaleDateString()}
          </p>
          {p.buyer_id && <p>done</p>}
        </div>
      ))}
    </div>
  );
};
