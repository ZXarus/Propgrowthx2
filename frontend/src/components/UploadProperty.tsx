import { useState } from "react";

export const UploadProperty: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [property_name, setPropertyName] = useState("");
  const [address, setAddress] = useState("");
  const [prize, setPrize] = useState("");
  const [property_type, setPropertyType] = useState("");
  const [total_area, setTotalArea] = useState("");
  const [water_available, setWaterAvailable] = useState(false);
  const [electricity_available, setElectricityAvailable] = useState(false);
  const [availability_status, setAvailabilityStatus] = useState("");
  const [monthly_rent, setMonthlyRent] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:6876/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner_id: ownerId,
          property_name,
          address,
          prize: Number(prize),
          property_type,
          total_area: Number(total_area),
          water_available,
          electricity_available,
          availability_status,
          monthly_rent: Number(monthly_rent),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Property uploaded successfully");

      // reset
      setPropertyName("");
      setAddress("");
      setPrize("");
      setPropertyType("");
      setTotalArea("");
      setWaterAvailable(false);
      setElectricityAvailable(false);
      setAvailabilityStatus("");
      setMonthlyRent("");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Upload Property (Land)</h2>

      <input
        type="text"
        placeholder="Property Name"
        value={property_name}
        onChange={(e) => setPropertyName(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Price"
        value={prize}
        onChange={(e) => setPrize(e.target.value)}
      />
      <br />

      <input
        type="text"
        placeholder="Property Type (Residential / Commercial / Agri)"
        value={property_type}
        onChange={(e) => setPropertyType(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Total Area"
        value={total_area}
        onChange={(e) => setTotalArea(e.target.value)}
      />
      <br />

      <label>
        <input
          type="checkbox"
          checked={water_available}
          onChange={(e) => setWaterAvailable(e.target.checked)}
        />
        Water Available
      </label>
      <br />

      <label>
        <input
          type="checkbox"
          checked={electricity_available}
          onChange={(e) => setElectricityAvailable(e.target.checked)}
        />
        Electricity Available
      </label>
      <br />

      <input
        type="text"
        placeholder="Availability Status (Available / Sold)"
        value={availability_status}
        onChange={(e) => setAvailabilityStatus(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Monthly Rent (optional)"
        value={monthly_rent}
        onChange={(e) => setMonthlyRent(e.target.value)}
      />
      <br />

      <br />
      <br />

      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Property"}
      </button>

      <br />
      {message && <p>{message}</p>}
    </div>
  );
};
