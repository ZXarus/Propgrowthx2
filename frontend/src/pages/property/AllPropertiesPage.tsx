import React, { useRef, useState } from "react";

type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  rentINR?: number;
  beds?: number;
  baths?: number;
  areaSqft?: number;
  status?: "Available" | "Occupied" | "Vacant";
  images: string[];
};

const BRAND = "#DC2626";

export default function AllPropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const properties = SAMPLE_PROPERTIES;

  const filteredProperties = properties.filter(p => 
    filterStatus === "All" || p.status === filterStatus
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg overflow-hidden">
                  <img 
                    src="/logo.png" 
                    alt="PropGrowthX Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-gray-900">All Properties</h1>
              </div>
              <p className="text-sm text-gray-600">Browse and manage your complete portfolio</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-500">
                {filteredProperties.length} properties
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-8 py-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Filters */}
            <div className="flex items-center gap-3">
              <select 
                className="px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:border-red-300 focus:ring-4 focus:ring-red-50 transition-all duration-200" 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Available</option>
                <option>Occupied</option>
                <option>Vacant</option>
              </select>
            </div>

            {/* View Toggle */}
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

      {/* Properties Grid */}
      <div className="px-8 pb-8">
        <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} viewMode={viewMode} />
          ))}
        </div>
      </div>
    </div>
  );
}

function PropertyCard({ property, viewMode }: { property: Property; viewMode: "grid" | "list" }) {
  const statusColors = {
    Available: "bg-green-100 text-green-800 border-green-200",
    Occupied: "bg-blue-100 text-blue-800 border-blue-200",
    Vacant: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="flex gap-6">
          <div className="flex-shrink-0">
            <div className="w-32 h-24 rounded-xl overflow-hidden bg-gray-100">
              {property.images.length > 0 ? (
                <img src={property.images[0]} alt={property.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-building text-2xl text-gray-400"></i>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{property.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{property.address}, {property.city}, {property.state}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <i className="fas fa-bed text-xs"></i>
                    <span>{property.beds ?? 0} beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-bath text-xs"></i>
                    <span>{property.baths ?? 0} baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <i className="fas fa-ruler-combined text-xs"></i>
                    <span>{property.areaSqft ?? "—"} sqft</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {formatINR(property.rentINR)}
                </div>
                <div className="text-xs text-gray-500 mb-3">/month</div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
                  {property.status}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <button className="px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
                View Details
              </button>
              <button className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
      {/* Image Carousel */}
      <div className="relative">
        <ImageCarousel images={property.images} propertyId={property.id} />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200">
              {property.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{property.address}, {property.city}, {property.state}</p>
          </div>
          
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-gray-900">{formatINR(property.rentINR)}</div>
            <div className="text-xs text-gray-500">/month</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <i className="fas fa-bed text-xs"></i>
            <span>{property.beds ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-bath text-xs"></i>
            <span>{property.baths ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <i className="fas fa-ruler-combined text-xs"></i>
            <span>{property.areaSqft ?? "—"} sqft</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg" style={{ background: BRAND }}>
            View Details
          </button>
          <button className="flex-1 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium hover:bg-gray-50 transition-colors duration-200">
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function ImageCarousel({ images, propertyId }: { images: string[]; propertyId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  function scrollBy(offset: number) {
    if (!ref.current) return;
    ref.current.scrollBy({ left: offset, behavior: "smooth" });
  }

  if (images.length === 0) {
    return (
      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <i className="fas fa-building text-4xl text-gray-400"></i>
      </div>
    );
  }

  return (
    <div className="relative h-48 overflow-hidden">
      <div
        ref={ref}
        className="flex h-full overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {images.map((src, i) => (
          <div key={i} className="flex-shrink-0 w-full h-full snap-center">
            <img src={src} alt={`${propertyId} image ${i + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => scrollBy(-320)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <i className="fas fa-chevron-left text-sm text-gray-600"></i>
          </button>
          
          <button
            onClick={() => scrollBy(320)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors duration-200"
          >
            <i className="fas fa-chevron-right text-sm text-gray-600"></i>
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-white/60 border border-white/30"></div>
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

const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "p1",
    name: "Sunset Villa",
    address: "8819 Ohio St",
    city: "Mumbai",
    state: "Maharashtra",
    rentINR: 120000,
    beds: 2,
    baths: 1,
    areaSqft: 900,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1505691723518-36a5a0b0f1c0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
  },
  {
    id: "p2",
    name: "Maple Apartments",
    address: "12 Maple Ave",
    city: "Bangalore",
    state: "Karnataka",
    rentINR: 80000,
    beds: 1,
    baths: 1,
    areaSqft: 550,
    status: "Occupied",
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
  },
  {
    id: "p3",
    name: "Orchard House",
    address: "45 Orchard Lane",
    city: "Delhi",
    state: "Delhi",
    rentINR: 84000,
    beds: 2,
    baths: 1,
    areaSqft: 780,
    status: "Vacant",
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
  },
  {
    id: "p4",
    name: "Garden View Apartment",
    address: "23 Garden Street",
    city: "Pune",
    state: "Maharashtra",
    rentINR: 95000,
    beds: 3,
    baths: 2,
    areaSqft: 1200,
    status: "Available",
    images: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
      "https://images.unsplash.com/photo-1505691723518-36a5a0b0f1c0?q=80&w=1600&auto=format&fit=crop&ixlib=rb-4.0.3",
    ],
  },
];