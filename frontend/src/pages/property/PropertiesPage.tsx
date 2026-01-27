import React, { useEffect, useRef, useState } from "react";

type PropertyRecord = {
  id: string;
  name: string;
  listingType: "For Rent" | "For Sale";
  category: string;
  status: string;
  rentPerMonth?: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  bedrooms: number;
  bathrooms: number;
  areaSqft?: number;
  otherRooms?: number;
  floors?: number;
  description?: string;
  amenities?: string[];
  images?: { id: string; url: string; name: string }[];
  createdAt: string;
};

const BRAND = "#DC2626";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = properties.filter((p) => {
    const q = query.trim().toLowerCase();
    if (q) {
      if (!`${p.name} ${p.address.city} ${p.address.state}`.toLowerCase().includes(q)) return false;
    }
    if (typeFilter !== "All Types" && p.listingType !== typeFilter) return false;
    if (statusFilter !== "All Status" && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="PropGrowthX Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
              </div>
              <p className="text-gray-600">Manage your property portfolio with ease</p>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
            >
              <i className="fas fa-plus text-sm"></i>
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search properties..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200 text-sm"
                />
              </div>
            </div>

            {/* Filters & View Toggle */}
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                value={typeFilter} 
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option>All Types</option>
                <option>For Rent</option>
                <option>For Sale</option>
              </select>

              <select 
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Status</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Vacant</option>
                <option>Under Maintenance</option>
              </select>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === "list" 
                      ? "bg-white text-gray-900 shadow-sm" 
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-8">
        {filtered.length === 0 ? (
          <EmptyState onAddProperty={() => setModalOpen(true)} />
        ) : viewMode === "grid" ? (
          <PropertyGrid properties={filtered} />
        ) : (
          <PropertyList properties={filtered} />
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <AddPropertyModal
          onClose={() => setModalOpen(false)}
          onCreate={(p) => {
            setProperties((s) => [p, ...s]);
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ onAddProperty }: { onAddProperty: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <i className="fas fa-building text-2xl text-gray-400"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties yet</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start building your portfolio by adding your first property. Track rent, manage tenants, and optimize your investments.
      </p>
      <button
        onClick={onAddProperty}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
      >
        <i className="fas fa-plus text-sm"></i>
        Add Your First Property
      </button>
    </div>
  );
}

function PropertyGrid({ properties }: { properties: PropertyRecord[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function PropertyCard({ property }: { property: PropertyRecord }) {
  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-blue-100 text-blue-800",
    Vacant: "bg-yellow-100 text-yellow-800",
    "Under Maintenance": "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0].url} alt={property.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-building text-4xl text-gray-400"></i>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
            {property.listingType}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
          {property.name}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {property.address.street}, {property.address.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900">
            {property.rentPerMonth ? `₹${property.rentPerMonth.toLocaleString()}` : "—"}
            {property.listingType === "For Rent" && <span className="text-sm font-normal text-gray-600">/mo</span>}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-xs"></i>
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-xs"></i>
            <span>{property.bathrooms}</span>
          </div>
          {property.areaSqft && (
            <div className="flex items-center gap-1">
              <i className="fas fa-ruler-combined text-xs"></i>
              <span>{property.areaSqft} sqft</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
          <button className="flex-1 px-4 py-2 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyList({ properties }: { properties: PropertyRecord[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Property</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Type</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Rent</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Status</th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">Details</th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <PropertyRow key={property.id} property={property} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PropertyRow({ property }: { property: PropertyRecord }) {
  const statusColors = {
    Available: "bg-green-100 text-green-800",
    Occupied: "bg-blue-100 text-blue-800", 
    Vacant: "bg-yellow-100 text-yellow-800",
    "Under Maintenance": "bg-red-100 text-red-800",
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0].url} alt={property.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <i className="fas fa-building text-gray-400"></i>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{property.name}</div>
            <div className="text-sm text-gray-600">{property.address.street}, {property.address.city}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">{property.listingType}</td>
      <td className="py-4 px-6">
        <div className="font-semibold text-gray-900">
          {property.rentPerMonth ? `₹${property.rentPerMonth.toLocaleString()}` : "—"}
        </div>
        {property.listingType === "For Rent" && property.rentPerMonth && (
          <div className="text-sm text-gray-600">per month</div>
        )}
      </td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
          {property.status}
        </span>
      </td>
      <td className="py-4 px-6 text-sm text-gray-600">
        {property.bedrooms} bed • {property.bathrooms} bath
        {property.areaSqft && ` • ${property.areaSqft} sqft`}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
          <button className="px-3 py-1.5 rounded-lg text-white text-sm font-medium transition-all duration-200" style={{ background: BRAND }}>
            View
          </button>
        </div>
      </td>
    </tr>
  );
}

function AddPropertyModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: PropertyRecord) => void }) {
  const [name, setName] = useState("");
  const [listingType, setListingType] = useState<PropertyRecord["listingType"]>("For Rent");
  const [category, setCategory] = useState("Apartment");
  const [status, setStatus] = useState("Available");
  const [rentPerMonth, setRentPerMonth] = useState<number | undefined>(85000);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [areaSqft, setAreaSqft] = useState<number | undefined>(1200);
  const [description, setDescription] = useState("");
  const [amenitiesText, setAmenitiesText] = useState("");
  const [images, setImages] = useState<{ id: string; url: string; name: string }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleImageFiles(files: FileList | null) {
    if (!files) return;
    const allowed = 5 - images.length;
    const toTake = Math.min(files.length, allowed);
    const arr = Array.from(files).slice(0, toTake);
    arr.forEach((file) => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is larger than 10MB — skipped.`);
        return;
      }
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const url = URL.createObjectURL(file);
      setImages((s) => [...s, { id, url, name: file.name }]);
    });
  }

  function removeImage(id: string) {
    setImages((s) => s.filter((i) => i.id !== id));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Property name is required";
    if (listingType === "For Rent" && (!rentPerMonth || rentPerMonth <= 0)) e.rentPerMonth = "Enter rent amount";
    if (!street.trim()) e.street = "Address required";
    if (!city.trim()) e.city = "City required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit() {
    if (!validate()) return;
    const newProp: PropertyRecord = {
      id: `${Date.now()}`,
      name: name.trim(),
      listingType,
      category,
      status,
      rentPerMonth,
      address: { street, city, state, zip, country: "India" },
      bedrooms,
      bathrooms,
      areaSqft,
      description,
      amenities: amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      images,
      createdAt: new Date().toISOString(),
    };
    onCreate(newProp);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
              <p className="text-gray-600 mt-1">Create a new property listing</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200">
              <i className="fas fa-times text-gray-600"></i>
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Property Name</label>
                <input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g., Modern Downtown Loft" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
                {errors.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Listing Type</label>
                <select 
                  value={listingType} 
                  onChange={(e) => setListingType(e.target.value as any)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                >
                  <option>For Rent</option>
                  <option>For Sale</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
                <select 
                  value={status} 
                  onChange={(e) => setStatus(e.target.value)} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                >
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Vacant</option>
                  <option>Under Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Rent per Month </label>
                <input 
                  type="number" 
                  value={rentPerMonth ?? ""} 
                  onChange={(e) => setRentPerMonth(Number(e.target.value))} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
                {errors.rentPerMonth && <div className="text-sm text-red-600 mt-1">{errors.rentPerMonth}</div>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Address</label>
              <div className="space-y-3">
                <input 
                  value={street} 
                  onChange={(e) => setStreet(e.target.value)} 
                  placeholder="Street Address" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <input 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="City" 
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                  />
                  <input 
                    value={state} 
                    onChange={(e) => setState(e.target.value)} 
                    placeholder="State" 
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                  />
                  <input 
                    value={zip} 
                    onChange={(e) => setZip(e.target.value)} 
                    placeholder="Zip Code" 
                    className="px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bedrooms</label>
                <input 
                  type="number" 
                  min={0} 
                  value={bedrooms} 
                  onChange={(e) => setBedrooms(Number(e.target.value))} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Bathrooms</label>
                <input 
                  type="number" 
                  min={0} 
                  value={bathrooms} 
                  onChange={(e) => setBathrooms(Number(e.target.value))} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-900 mb-2">Area (sqft)</label>
                <input 
                  type="number" 
                  min={0} 
                  value={areaSqft ?? ""} 
                  onChange={(e) => setAreaSqft(Number(e.target.value))} 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Describe your property..." 
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200 resize-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Amenities (comma-separated)</label>
              <input 
                value={amenitiesText} 
                onChange={(e) => setAmenitiesText(e.target.value)} 
                placeholder="Parking, Pool, Gym, Balcony" 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Property Images</label>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-red-300 transition-colors duration-200">
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  multiple
                  onChange={(e) => handleImageFiles(e.target.files)}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-cloud-upload-alt text-xl text-gray-400"></i>
                  </div>
                  <div className="text-sm font-medium text-gray-900 mb-1">Click to upload images (max 5)</div>
                  <div className="text-xs text-gray-500">PNG, JPG up to 10MB each</div>
                </label>
              </div>
              
              {images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={img.name} className="w-full h-20 object-cover rounded-lg" />
                      <button 
                        onClick={() => removeImage(img.id)} 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors duration-200"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-100">
            <button 
              onClick={onClose} 
              className="flex-1 px-6 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              className="flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
            >
              Add Property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}