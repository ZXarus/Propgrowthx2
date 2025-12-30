import React, { useState } from "react";

const UploadProperty: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [form, setForm] = useState({
    property_name: "",
    address: "",
    prize: "",
    property_type: "",
    total_area: "",
    availability_status: "",
    monthly_rent: "",
  });

  const [water, setWater] = useState(false);
  const [electricity, setElectricity] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async () => {
    if (!image) {
      setMessage("❌ Please upload property image");
      return;
    }

    setLoading(true);
    setMessage("");

    const data = new FormData();
    data.append("owner_id", ownerId);
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("water_available", String(water));
    data.append("electricity_available", String(electricity));
    data.append("image", image);

    try {
      const res = await fetch(
        "http://localhost:6876/api/properties/create",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      setMessage("✅ Property uploaded successfully");
      setForm({
        property_name: "",
        address: "",
        prize: "",
        property_type: "",
        total_area: "",
        availability_status: "",
        monthly_rent: "",
      });
      setImage(null);
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Upload Property</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key.replace("_", " ").toUpperCase()}
          value={(form as any)[key]}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />
      ))}

      <div className="flex gap-4 mb-3">
        <label>
          <input
            type="checkbox"
            checked={water}
            onChange={(e) => setWater(e.target.checked)}
          />{" "}
          Water
        </label>
        <label>
          <input
            type="checkbox"
            checked={electricity}
            onChange={(e) => setElectricity(e.target.checked)}
          />{" "}
          Electricity
        </label>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Uploading..." : "Upload Property"}
      </button>

      {message && <p className="mt-3">{message}</p>}
    </div>
  );
};

export default UploadProperty;
