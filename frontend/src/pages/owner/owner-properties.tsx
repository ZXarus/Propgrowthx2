import React, { useEffect, useState } from "react";

const OwnerProperties: React.FC<{ ownerId: string }> = ({ ownerId }) => {
  const [props, setProps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `http://localhost:6876/api/properties/get_all_prop_by_owner?owner_id=${ownerId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setProps(data.properties || []);
        setLoading(false);
      });
  }, [ownerId]);

  if (loading) return <p>Loading properties...</p>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">All Properties</h2>

      {props.map((p) => (
        <div
          key={p.id}
          className="bg-white p-4 rounded shadow mb-3"
        >
          <p><b>{p.property_name}</b></p>
          <p>{p.address}</p>
          <p>₹{p.prize}</p>
          {p.image_url && (
            <img
              src={p.image_url}
              alt="property"
              className="h-40 mt-2 rounded"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default OwnerProperties;
