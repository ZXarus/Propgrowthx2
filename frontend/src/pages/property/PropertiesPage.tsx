import React, { useEffect, useRef, useState } from "react";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";

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
      {/* Back to Dashboard Button */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <button
          onClick={() => window.location.href = '/dashboard-nav'}
          className="inline-flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:bg-white hover:text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <i className="fas fa-arrow-left w-4 h-4"></i>
          <span className="font-medium hidden sm:inline">Back</span>
        </button>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4 md:px-8 md:py-6 pl-16 md:pl-40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="PropGrowthX Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900">Properties</h1>
              </div>
              <p className="text-sm md:text-base text-gray-600">Manage your property portfolio with ease</p>
            </div>
            
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 text-sm md:text-base"
              style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
            >
              <i className="fas fa-plus text-sm"></i>
              <span className="hidden sm:inline">Add Property</span>
              <span className="sm:hidden">Add</span>
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
      <div className="px-4 pb-8 md:px-8">
        {filtered.length === 0 ? (
          <EmptyState onAddProperty={() => setModalOpen(true)} />
        ) : viewMode === "grid" ? (
          <PropertyGrid properties={filtered} />
        ) : (
          <PropertyList properties={filtered} />
        )}
      </div>

      {/* Modal */}
      <AddPropertyModal
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      <div className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 text-sm md:text-base">
          {property.name}
        </h3>
        <p className="text-xs md:text-sm text-gray-600 mb-4">
          {property.address.street}, {property.address.city}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="text-lg md:text-2xl font-bold text-gray-900">
            {property.rentPerMonth ? `₹${property.rentPerMonth.toLocaleString()}` : "—"}
            {property.listingType === "For Rent" && <span className="text-xs md:text-sm font-normal text-gray-600">/mo</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 mb-4">
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
          <button className="flex-1 px-3 py-2 md:px-4 md:py-2 rounded-xl border border-gray-200 text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
          <button className="flex-1 px-3 py-2 md:px-4 md:py-2 rounded-xl text-white text-xs md:text-sm font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
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