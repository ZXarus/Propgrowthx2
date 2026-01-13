import { useState } from "react";
import "../styles/uploadProperty.css";

type UploadPropertyProps = {
  ownerId: string;
};

export const UploadProperty: React.FC<UploadPropertyProps> = ({ ownerId }) => {
  const [property_name, setPropertyName] = useState("");
  const [veri_image, setVeriImage] = useState<File | null>(null);

  const [address, setAddress] = useState("");
  const [prize, setPrize] = useState("");
  const [property_type, setPropertyType] = useState("Residential");
  const [total_area, setTotalArea] = useState("");
  const [water_available, setWaterAvailable] = useState(false);
  const [electricity_available, setElectricityAvailable] = useState(false);
  const [availability_status, setAvailabilityStatus] = useState("Available");
  const [monthly_rent, setMonthlyRent] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("owner_id", ownerId);
      formData.append("property_name", property_name);
      formData.append("address", address);
      formData.append("prize", prize);
      formData.append("property_type", property_type);
      formData.append("total_area", total_area);
      formData.append("water_available", String(water_available));
      formData.append("electricity_available", String(electricity_available));
      formData.append("status", availability_status);
      formData.append("monthly_rent", monthly_rent);
      if (veri_image) {
        formData.append("veri_image", veri_image);
      }

      images.forEach((img) => {
        formData.append("images", img);
      });

      const formDataObj = Object.fromEntries(formData.entries());
      console.log("FormData Object:", formDataObj);

      const res = await fetch("http://localhost:6876/api/properties/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Property uploaded successfully");

      // reset fields
      setPropertyName("");
      setAddress("");
      setPrize("");
      setPropertyType("Residential");
      setTotalArea("");
      setWaterAvailable(false);
      setElectricityAvailable(false);
      setAvailabilityStatus("Available");
      setMonthlyRent("");
      setImages([]);
    } catch (err) {
      if (err instanceof Error) {
        setMessage("❌ " + err.message);
      } else {
        setMessage("❌ Upload failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Property</h2>

      <input
        className="upload-input"
        placeholder="Property Name"
        value={property_name}
        onChange={(e) => setPropertyName(e.target.value)}
      />

      <input
        className="upload-input"
        placeholder="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        className="upload-input"
        type="number"
        placeholder="Price"
        value={prize}
        onChange={(e) => setPrize(e.target.value)}
      />

      <select
        className="upload-input"
        value={property_type}
        onChange={(e) => setPropertyType(e.target.value)}
      >
        <option value="Residential">Residential</option>
        <option value="Commercial">Commercial</option>
        <option value="Agri">Agricultural</option>
      </select>

      <input
        className="upload-input"
        type="number"
        placeholder="Total Area"
        value={total_area}
        onChange={(e) => setTotalArea(e.target.value)}
      />

      <input
        className="upload-input"
        type="file"
        accept="image/*"
        onChange={(e) =>
          setVeriImage(e.target.files ? e.target.files[0] : null)
        }
      />

      <label>
        <input
          type="checkbox"
          checked={water_available}
          onChange={(e) => setWaterAvailable(e.target.checked)}
        />
        Water Available
      </label>

      <label>
        <input
          type="checkbox"
          checked={electricity_available}
          onChange={(e) => setElectricityAvailable(e.target.checked)}
        />
        Electricity Available
      </label>

      <select
        className="upload-input"
        value={availability_status}
        onChange={(e) => setAvailabilityStatus(e.target.value)}
      >
        <option value="Available">Available</option>
        <option value="Sold">Sold</option>
      </select>

      <input
        className="upload-input"
        type="number"
        placeholder="Monthly Rent (optional)"
        value={monthly_rent}
        onChange={(e) => setMonthlyRent(e.target.value)}
      />

      <input
        className="upload-input"
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = e.target.files;
          if (files) setImages(Array.from(files));
        }}
      />

      <button className="upload-btn" onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Property"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
};
