import React, { useEffect, useRef, useState } from "react";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import type { PropertyData } from "../../components/dashboard/EditPropertyModal";
import { useData } from "@/context/dataContext";

const BRAND = "#DC2626";

const STATUS_COLORS: Record<string, string> = {
  Available: "bg-green-100 text-green-800",
  Occupied: "bg-blue-100 text-blue-800",
  Vacant: "bg-yellow-100 text-yellow-800",
  "Under Maintenance": "bg-red-100 text-red-800",
};
export default function PropertiesPage() {
  const { properties, setProperties } = useData();

  console.log(properties);

  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filtered = properties.filter((p) => {
    const q = query.trim().toLowerCase();

    if (q) {
      if (!`${p.property_name} ${p.city} ${p.state}`.toLowerCase().includes(q))
        return false;
    }

    if (typeFilter !== "All Types" && p.listing_type !== typeFilter)
      return false;

    if (statusFilter !== "All Status" && p.status !== statusFilter)
      return false;

    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 py-4 md:px-8 md:py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Properties</h1>

            <button
              onClick={() => setModalOpen(true)}
              className="px-6 py-3 rounded-xl text-white font-semibold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)`,
              }}
            >
              Add Property
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-8 py-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex gap-4 flex-wrap">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search properties..."
              className="px-4 py-3 rounded-xl border border-gray-200"
            />

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200"
            >
              <option>All Types</option>
              <option>RENT</option>
              <option>SALE</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-200"
            >
              <option>All Status</option>
              <option>AVAILABLE</option>
              <option>BOOKED</option>
              <option>SOLD</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 pb-8">
        {filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl">
            No properties yet
          </div>
        ) : viewMode === "grid" ? (
          <PropertyGrid properties={filtered} />
        ) : (
          <PropertyList properties={filtered} />
        )}
      </div>

      <AddPropertyModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

function EmptyState({ onAddProperty }: { onAddProperty: () => void }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
      <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <i className="fas fa-building text-2xl text-gray-400"></i>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No properties yet
      </h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto">
        Start building your portfolio by adding your first property. Track rent,
        manage tenants, and optimize your investments.
      </p>
      <button
        onClick={onAddProperty}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        style={{
          background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)`,
        }}
      >
        <i className="fas fa-plus text-sm"></i>
        Add Your First Property
      </button>
    </div>
  );
}

function PropertyGrid({ properties }: { properties: PropertyData[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}

function PropertyCard({ property }: { property: PropertyData }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      {/* Image */}
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {property.images?.length ? (
          <img
            src={property.images[0]}
            alt={property.property_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-building text-4xl text-gray-400"></i>
          </div>
        )}

        <div className="absolute top-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              STATUS_COLORS[property.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {property.status}
          </span>
        </div>

        <div className="absolute top-4 right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
            {property.listing_type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 text-sm md:text-base">
          {property.property_name}
        </h3>

        <p className="text-xs md:text-sm text-gray-600 mb-4">
          {property.address} {property.city}
        </p>

        <div className="text-lg md:text-2xl font-bold text-gray-900 mb-4">
          {property.monthly_rent
            ? `₹${property.monthly_rent.toLocaleString()}`
            : "—"}

          {property.listing_type === "RENT" && property.monthly_rent && (
            <span className="text-xs md:text-sm font-normal text-gray-600">
              /mo
            </span>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs md:text-sm text-gray-600 mb-4">
          <span>{property.bedrooms} bed</span>
          <span>{property.bathrooms} bath</span>
          {property.total_area && <span>{property.total_area} sqft</span>}
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs md:text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>

          <button
            className="flex-1 px-3 py-2 rounded-xl text-white text-xs md:text-sm font-medium transition-all duration-200"
            style={{ background: BRAND }}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

function PropertyList({ properties }: { properties: PropertyData[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                Property
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                Type
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                Rent
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="text-left py-4 px-6 text-sm font-semibold text-gray-900">
                Details
              </th>
              <th className="text-right py-4 px-6 text-sm font-semibold text-gray-900">
                Actions
              </th>
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
function PropertyRow({ property }: { property: PropertyData }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-200">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
            {property.images?.length ? (
              <img
                src={property.images[0]}
                alt={property.property_name}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <i className="fas fa-building text-gray-400"></i>
            )}
          </div>

          <div>
            <div className="font-semibold text-gray-900">
              {property.property_name}
            </div>
            <div className="text-sm text-gray-600">
              {property.address}, {property.city}
            </div>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 text-sm text-gray-600">
        {property.listing_type}
      </td>

      <td className="py-4 px-6 font-semibold text-gray-900">
        {property.monthly_rent
          ? `₹${property.monthly_rent.toLocaleString()}`
          : "—"}
      </td>

      <td className="py-4 px-6">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            STATUS_COLORS[property.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {property.status}
        </span>
      </td>

      <td className="py-4 px-6 text-sm text-gray-600">
        {property.bedrooms} bed • {property.bathrooms} bath
        {property.total_area && ` • ${property.total_area} sqft`}
      </td>

      <td className="py-4 px-6 text-right">
        <div className="flex justify-end gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
            Edit
          </button>
          <button
            className="px-3 py-1.5 rounded-lg text-white text-sm"
            style={{ background: BRAND }}
          >
            View
          </button>
        </div>
      </td>
    </tr>
  );
}
