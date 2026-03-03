import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [properties, setProperties] = useState<PropertyRecord[]>([]);
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All Types");
  const [statusFilter, setStatusFilter] = useState<string>("All Status");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Desktop/tablet: true = wide (w-64), false = collapsed (w-20)
  // Mobile: true = drawer open, false = drawer closed
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Detect mobile to start sidebar closed
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Mobile nav helper — close drawer then navigate
  const mobileGoTo = (path: string) => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    navigate(path);
  };

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
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ═══════════════════════════════════════
          MOBILE ONLY — floating hamburger button.
          Shown only when drawer is closed (< md).
          Invisible on tablet/desktop.
      ═══════════════════════════════════════ */}
      {!sidebarOpen && (
        <button
          className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
            bg-white border border-gray-200 rounded-xl shadow-md
            hover:bg-gray-50 transition-all duration-200"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <i className="fas fa-bars text-gray-700 text-sm"></i>
        </button>
      )}

      {/* ═══════════════════════════════════════
          MOBILE ONLY — dark backdrop.
          Covers content when drawer is open.
      ═══════════════════════════════════════ */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ═══════════════════════════════════════
          MOBILE ONLY — full drawer (fixed, slides in).
          Auto-closes on every nav link click.
          Hidden on md+.
      ═══════════════════════════════════════ */}
      <aside
        className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 z-50
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-md overflow-hidden shadow-sm flex-shrink-0">
            <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-semibold text-gray-900 text-base">PropGrowthX</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto p-1.5 rounded-md hover:bg-gray-50 text-gray-500"
            aria-label="Close menu"
          >
            <i className="fas fa-times text-sm"></i>
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-2 py-4 flex-1 overflow-y-auto">
          {[
            { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  path: "/dashboard-nav" },
            { id: "properties", label: "Properties", icon: "fa-building",   path: "/properties-manage" },
            { id: "payments",   label: "Payments",   icon: "fa-receipt",    path: "/payments" },
            { id: "support",    label: "Support",    icon: "fa-headset",    path: "/contact" },
            { id: "complaints", label: "Complaints", icon: "fa-folder",     path: "/dashboard/owner/complaints" },
            { id: "profile",    label: "Profile",    icon: "fa-user",       path: "/profile" },
            { id: "settings",   label: "Settings",   icon: "fa-cog",        path: "/profile#settings" },
          ].map((item) => (
            <MobileNavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={item.id === "properties"}
              onClick={() => item.path ? mobileGoTo(item.path) : setSidebarOpen(false)}
            />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          DESKTOP / TABLET SIDEBAR — inline in flex row.
          Visible on md+. Toggles between w-64 and w-20.
          Zero mobile changes here.
      ═══════════════════════════════════════ */}
      <aside
        className={`hidden md:flex flex-col flex-shrink-0 bg-white border-r border-gray-100 h-screen sticky top-0 z-40
          transition-all duration-200 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"}`}
        aria-label="Sidebar"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100">
          <div className="w-12 h-12 rounded-md overflow-hidden shadow-sm flex-shrink-0">
            <img src="/logo.png" alt="PropGrowthX Logo" className="w-full h-full object-contain" />
          </div>
          {sidebarOpen && (
            <span className="font-semibold text-gray-900 text-lg">PropGrowthX</span>
          )}
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="ml-auto bg-transparent p-2 rounded-md hover:bg-gray-50"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <i className={`fas ${sidebarOpen ? "fa-chevron-left" : "fa-chevron-right"} text-gray-600 text-sm`}></i>
          </button>
        </div>

        {/* Nav items */}
        <nav className="px-2 py-4 flex-1 overflow-y-auto">
          {[
            { id: "dashboard",   label: "Dashboard",   icon: "fa-chart-bar",  onClick: () => navigate("/dashboard-nav") },
            { id: "properties", label: "Properties", icon: "fa-building",   onClick: () => navigate("/properties-manage") },
            { id: "payments",   label: "Payments",   icon: "fa-receipt",    onClick: () => navigate("/payments") },
            { id: "support",    label: "Support",    icon: "fa-headset",    onClick: () => navigate("/contact") },
            { id: "complaints", label: "Complaints", icon: "fa-folder",     onClick: () => navigate("/dashboard/owner/complaints") },
            { id: "profile",    label: "Profile",    icon: "fa-user",       onClick: () => navigate("/profile") },
            { id: "settings",   label: "Settings",   icon: "fa-cog",        onClick: () => navigate("/profile#settings") },
          ].map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              collapsed={!sidebarOpen}
              active={item.id === "properties"}
              onClick={item.onClick}
            />
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="text-xs text-gray-500">© {new Date().getFullYear()} PropGrowthX</div>
          ) : (
            <div className="text-center text-xs text-gray-400">©PG</div>
          )}
        </div>
      </aside>

      {/* ═══════════════════════════════════════
          MAIN CONTENT — full width, scrollable.
          On mobile: no sidebar offset needed.
      ═══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');
          * { font-family: 'Geist', sans-serif; }
          :root { --brand-red: #DC2626; --muted: #6b7280; }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .prop-page-title { font-family: 'Inter','Geist',system-ui,sans-serif; font-size: clamp(28px,4vw,48px); font-weight: 400; letter-spacing: -1.5px; line-height: 1.1; color: #0b1220; margin: 0; animation: slideInLeft 0.7s ease-out 0.1s both; }
          .prop-title-accent { color: var(--brand-red); font-weight: 700; animation: slideInRight 0.7s ease-out 0.2s both; display: inline-block; }
          .prop-header-hero { position: relative; padding: 24px 28px 28px; border-radius: 16px; background: linear-gradient(180deg,#FFF5F5 0%,#FFE4E6 100%); border: 1px solid rgba(220,38,38,0.12); animation: fadeInUp 0.8s ease-out 0s both; }
          @media (min-width: 768px) { .prop-header-hero { padding: 32px 40px 36px; border-radius: 20px; } }
          .prop-header-hero::after { content: ''; position: absolute; inset: 0; border-radius: inherit; pointer-events: none; box-shadow: 0 20px 50px rgba(2,6,23,0.05); }
          .prop-header-subtitle { font-size: 14px; color: var(--muted); font-weight: 400; letter-spacing: 0.2px; line-height: 1.6; margin-top: 10px; animation: fadeInUp 0.8s ease-out 0.25s both; }
          @media (max-width: 768px) { .prop-header-subtitle { font-size: 13px; margin-top: 8px; } }
          .prop-divider-line { height: 1px; background: linear-gradient(90deg,rgba(220,38,38,0),rgba(220,38,38,0.3) 20%,rgba(220,38,38,0.5) 50%,rgba(220,38,38,0.3) 80%,rgba(220,38,38,0)); width: 100%; margin-top: 16px; animation: fadeInUp 0.8s ease-out 0.35s both; }
        `}</style>

        {/* Hero Header */}
        <div className="bg-white flex-shrink-0 px-4 sm:px-6 md:px-8 py-4 md:py-6">
          <div className="max-w-6xl mx-auto">
            <div className="prop-header-hero">
              <h1 className="prop-page-title mb-2">
                My <span className="prop-title-accent">Properties</span>
              </h1>
              <p className="prop-header-subtitle">Manage your property portfolio, track performance, and monitor tenant information all in one place.</p>
              <div className="prop-divider-line" />
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white border-b border-gray-100 flex-shrink-0">
          <div className="px-4 sm:px-6 md:px-8 py-3 md:py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex-1"></div>

              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm md:text-base whitespace-nowrap flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${BRAND} 0%, #B91C1C 100%)` }}
              >
                <i className="fas fa-plus text-xs sm:text-sm"></i>
                <span className="hidden sm:inline">Add Property</span>
                <span className="sm:hidden">Add</span>
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white flex-shrink-0 border-b border-gray-100">
          <div className="px-4 sm:px-6 md:px-8 py-2.5 sm:py-3">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
              {/* Search */}
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <div className="relative">
                  <i className="fas fa-search absolute left-3 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search properties..."
                    className="w-full pl-9 sm:pl-10 pr-3 py-2 rounded-lg border border-gray-200 focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all duration-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              {/* Filters & View Toggle */}
              <div className="flex gap-1.5 sm:gap-2 items-center flex-wrap justify-center sm:justify-start">
                <select
                  className="px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all duration-200"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option>All Types</option>
                  <option>For Rent</option>
                  <option>For Sale</option>
                </select>

                <select
                  className="px-2.5 sm:px-3 py-2 rounded-lg border border-gray-200 bg-white text-xs font-medium focus:border-red-300 focus:ring-2 focus:ring-red-50 transition-all duration-200"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Available</option>
                  <option>Occupied</option>
                  <option>Vacant</option>
                  <option>Under Maintenance</option>
                </select>

                <div className="flex bg-gray-100 rounded-lg p-1 flex-shrink-0">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === "grid" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                    title="Grid view"
                  >
                    <i className="fas fa-th-large"></i>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-2 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"}`}
                    title="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            <div className="max-w-6xl mx-auto">
              {filtered.length === 0 ? (
                <EmptyState onAddProperty={() => setModalOpen(true)} />
              ) : viewMode === "grid" ? (
                <PropertyGrid properties={filtered} />
              ) : (
                <PropertyList properties={filtered} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AddPropertyModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}

// ─── Mobile-only nav item (always shows label, no collapsed state) ───
function MobileNavItem({ label, icon, active = false, onClick }: { label: string; icon: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-50"}`}
      aria-label={label}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0
        ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      <span className={`text-sm font-medium ${active ? "text-red-600 font-semibold" : ""}`}>{label}</span>
    </button>
  );
}

// ─── Desktop/tablet nav item (collapses to icon only) ───
function NavItem({ label, icon, collapsed = false, active = false, onClick }: { label: string; icon: string; collapsed?: boolean; active?: boolean; onClick?: () => void }) {
  return (
    <button
      className={`group w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors duration-150
        ${active ? "bg-red-50" : "hover:bg-gray-50"}`}
      aria-label={label}
      title={collapsed ? label : undefined}
      onClick={onClick}
    >
      <span className={`w-8 h-8 flex items-center justify-center rounded-md flex-shrink-0
        ${active ? "bg-red-100" : "bg-gray-50"}`}>
        <i className={`fas ${icon} text-sm ${active ? "text-red-600" : "text-gray-600"}`}></i>
      </span>
      {!collapsed && (
        <span className={`text-sm font-medium ${active ? "text-red-600 font-semibold" : "text-gray-900"}`}>{label}</span>
      )}
    </button>
  );
}

// ─── Unchanged sub-components below ───

function EmptyState({ onAddProperty }: { onAddProperty: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-12 sm:p-16 text-center max-w-2xl mx-auto">
      <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-xl bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center border border-red-100">
        <i className="fas fa-building text-2xl sm:text-3xl text-red-400"></i>
      </div>
      <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">No properties yet</h3>
      <p className="text-sm sm:text-base text-gray-600 mb-8 sm:mb-10">
        Start building your portfolio by adding your first property. Track rent, manage tenants, and optimize your investments.
      </p>
      <button
        onClick={onAddProperty}
        className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl text-white font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-sm sm:text-base"
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
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col h-full">
      <div className="h-40 sm:h-48 lg:h-56 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0].url} alt={property.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <i className="fas fa-building text-3xl sm:text-4xl text-gray-400"></i>
          </div>
        )}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/90 text-gray-800">
            {property.listingType}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200 text-sm sm:text-base line-clamp-2">
          {property.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-4 line-clamp-1 flex items-center gap-1">
          <i className="fas fa-map-marker-alt text-xs flex-shrink-0"></i>{property.address.street}, {property.address.city}
        </p>

        <div className="flex items-baseline justify-between mb-4">
          <div className="text-lg sm:text-2xl font-bold text-gray-900">
            {property.rentPerMonth ? `₹${property.rentPerMonth.toLocaleString()}` : "—"}
            {property.listingType === "For Rent" && property.rentPerMonth && <span className="text-xs sm:text-sm font-normal text-gray-600 ml-1">/mo</span>}
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs sm:text-sm text-gray-600 mb-4 flex-wrap">
          <div className="flex items-center gap-1.5"><i className="fas fa-bed text-xs text-red-600"></i><span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span></div>
          <div className="flex items-center gap-1.5"><i className="fas fa-bath text-xs text-red-600"></i><span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span></div>
          {property.areaSqft && <div className="flex items-center gap-1.5"><i className="fas fa-ruler-combined text-xs text-red-600"></i><span>{property.areaSqft} sqft</span></div>}
        </div>

        <div className="flex gap-2 mt-auto">
          <button className="flex-1 px-3 py-2.5 sm:py-3 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">Edit</button>
          <button className="flex-1 px-3 py-2.5 sm:py-3 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-lg transform hover:-translate-y-0.5" style={{ background: BRAND }}>View Details</button>
        </div>
      </div>
    </div>
  );
}

function PropertyList({ properties }: { properties: PropertyRecord[] }) {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Property</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden xs:table-cell">Type</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Rent</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden sm:table-cell">Status</th>
              <th className="text-left py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900 hidden md:table-cell">Details</th>
              <th className="text-right py-3 sm:py-4 px-4 sm:px-6 text-xs sm:text-sm font-semibold text-gray-900">Actions</th>
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
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0">
            {property.images && property.images.length > 0 ? (
              <img src={property.images[0].url} alt={property.name} className="w-full h-full object-cover" />
            ) : (
              <i className="fas fa-building text-gray-400"></i>
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 line-clamp-1 text-xs sm:text-sm">{property.name}</div>
            <div className="text-xs text-gray-600 line-clamp-1">{property.address.street}, {property.address.city}</div>
          </div>
        </div>
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden xs:table-cell text-gray-600 text-xs sm:text-sm">{property.listingType}</td>
      <td className="py-3 sm:py-4 px-4 sm:px-6">
        <div className="font-semibold text-gray-900 whitespace-nowrap text-xs sm:text-sm">
          {property.rentPerMonth ? `₹${property.rentPerMonth.toLocaleString()}` : "—"}
        </div>
        {property.listingType === "For Rent" && property.rentPerMonth && (
          <div className="text-xs text-gray-600">per month</div>
        )}
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden sm:table-cell">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block ${statusColors[property.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}`}>
          {property.status}
        </span>
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 hidden md:table-cell text-gray-600 text-xs sm:text-sm">
        {property.bedrooms} bed • {property.bathrooms} bath
        {property.areaSqft && ` • ${property.areaSqft} sqft`}
      </td>
      <td className="py-3 sm:py-4 px-4 sm:px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button className="px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200 text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors duration-200">Edit</button>
          <button className="px-3 py-1.5 sm:py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition-all duration-200" style={{ background: BRAND }}>View</button>
        </div>
      </td>
    </tr>
  );
}