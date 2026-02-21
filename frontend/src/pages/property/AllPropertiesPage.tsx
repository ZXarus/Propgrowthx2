import React, { useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/context/dataContext";
import { PropertyData } from "@/components/dashboard/EditPropertyModal";

const BRAND = "#DC2626";

export default function AllPropertiesPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const { properties } = useData();
  console.log(properties);

  const filteredProperties = properties.filter(
    (p) => filterStatus === "All" || p.status === filterStatus,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            {/* LEFT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              {/* Back Button */}
              <button
                onClick={() => navigate(-1)}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg
                           bg-white border border-gray-200 text-gray-700
                           hover:bg-gray-50 hover:shadow-sm
                           transition-all text-sm font-medium touch-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              {/* Logo + Title */}
              <div className="min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 mb-0 sm:mb-1">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src="/logo.png"
                      alt="PropGrowthX Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                    Properties
                  </h1>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">
                  Browse and manage your complete portfolio
                </p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end">
              <div className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                {filteredProperties.length} properties
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 p-2.5 sm:p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:gap-4">
            {/* Filters Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <label
                htmlFor="filter"
                className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0"
              >
                Status:
              </label>
              <select
                id="filter"
                className="flex-1 px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-xs sm:text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Vacant</option>
              </select>
            </div>

            {/* View Toggle Row */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-gray-600 font-medium flex-shrink-0 hidden sm:inline">
                View:
              </span>
              <div className="flex-1 sm:flex-none flex bg-gray-100 rounded-lg sm:rounded-xl p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="Grid view"
                >
                  <i className="fas fa-th-large"></i>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  title="List view"
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div
          className={`grid gap-4 sm:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode={viewMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  viewMode,
}: {
  property: PropertyData;
  viewMode: "grid" | "list";
}) {
  const statusColors = {
    Available: "bg-green-100 text-green-800 border-green-200",
    Occupied: "bg-blue-100 text-blue-800 border-blue-200",
    Vacant: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="flex-shrink-0">
            <div className="w-full sm:w-32 h-40 sm:h-24 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100">
              {property.images.length > 0 ? (
                <img
                  src={property.images[0]}
                  alt={property.property_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-building text-3xl sm:text-2xl text-gray-400"></i>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
                  {property.property_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2">
                  {property.address}, {property.city}, {property.state}
                </p>
              </div>

              <div className="text-left sm:text-right flex-shrink-0">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-0.5">
                  {formatINR(property.monthly_rent)}
                </div>
                <div className="text-xs sm:text-xs text-gray-500 mb-2">
                  /month
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
              <div className="flex items-center gap-1">
                <i className="fas fa-bed text-xs flex-shrink-0"></i>
                <span className="whitespace-nowrap">
                  {property.bedrooms ?? 0} beds
                </span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-bath text-xs flex-shrink-0"></i>
                <span className="whitespace-nowrap">
                  {property.bathrooms ?? 0} baths
                </span>
              </div>
              <div className="flex items-center gap-1">
                <i className="fas fa-ruler-combined text-xs flex-shrink-0"></i>
                <span className="whitespace-nowrap">
                  {property.total_area ?? "—"} sqft
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
              <span
                className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
              >
                {property.status}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-auto">
              <button
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg touch-none"
                style={{ background: BRAND }}
              >
                View Details
              </button>
              <button className="flex-1 px-3 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors duration-200 touch-none">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group flex flex-col h-full">
      {/* Image Carousel */}
      <div className="relative flex-shrink-0">
        <ImageCarousel images={property.images} propertyId={property.id} />
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4">
          <span
            className={`px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold border inline-block ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}
          >
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3 sm:mb-4 flex-grow-0">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-1">
              {property.property_name}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-1">
              {property.address}, {property.city}, {property.state}
            </p>
          </div>

          <div className="text-left sm:text-right flex-shrink-0">
            <div className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
              {formatINR(property.monthly_rent)}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              /month
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-xs flex-shrink-0"></i>
            <span className="whitespace-nowrap">{property.bedrooms ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-xs flex-shrink-0"></i>
            <span className="whitespace-nowrap">{property.bathrooms ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-ruler-combined text-xs flex-shrink-0"></i>
            <span className="whitespace-nowrap">
              {property.total_area ?? "—"} sqft
            </span>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg touch-none"
            style={{ background: BRAND }}
          >
            View Details
          </button>
          <button className="flex-1 px-3 sm:px-4 py-2 sm:py-2 rounded-lg sm:rounded-xl border border-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors duration-200 touch-none">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCarousel({
  images,
  propertyId,
}: {
  images: string[];
  propertyId: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  function scrollBy(offset: number) {
    if (!ref.current) return;
    ref.current.scrollBy({ left: offset, behavior: "smooth" });
  }

  if (images.length === 0) {
    return (
      <div className="h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <i className="fas fa-building text-4xl sm:text-5xl text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className="relative h-40 sm:h-48 overflow-hidden">
      <div
        ref={ref}
        className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-full h-full snap-center">
            <img
              src={src}
              alt={`${propertyId} image ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollBy(-320)}
            className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 touch-none"
            aria-label="Previous image"
          >
            <i className="fas fa-chevron-left text-xs sm:text-sm text-gray-600"></i>
          </button>

          <button
            onClick={() => scrollBy(320)}
            className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 sm:w-8 h-7 sm:h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200 touch-none"
            aria-label="Next image"
          >
            <i className="fas fa-chevron-right text-xs sm:text-sm text-gray-600"></i>
          </button>

          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-white/60 border border-white/30"
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function formatINR(n?: number) {
  if (n === undefined) return "—";
  return `₹${n.toLocaleString("en-IN")}`;
}
