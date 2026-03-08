import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  ArrowLeft,
  Search,
  Download,
  TrendingUp,
  Clock,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Menu,
  BarChart3,
  Home,
  DollarSign,
  FileText,
  HelpCircle,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import { useData } from "@/context/dataContext";
import {
  computeTransactionFilters,
  TransactionTable,
} from "@/components/tenant/TenantTransactionsAndFilter";

export interface Transaction {
  id: number;
  tenant_id?: string;
  owner_id?: string;
  property_id: string;
  property_name: string;
  tenant_name: string;
  type: "rent" | "deposit" | "maintenance";
  amount: string | number;
  date: string;
  due_date?: string;
  images?: string[];
  status: "completed" | "pending" | "overdue" | "upcoming";
  paymentMethod?: string;
  reference_no?: string;
}

const TenantTransactions = () => {
  const navigate = useNavigate();
  const { transactions, properties, loading } = useData();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");

  // KEY FIX: lazy initializer — desktop starts open and toggles freely.
  // Mobile starts closed (< 768px). No resize listener to fight desktop clicks.
  const [sidebarOpen, setSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );

  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safeProperties = Array.isArray(properties) ? properties : [];

  let filterResults = {
    allTransactions: [],
    filteredTransactions: [],
    pastTabTransactions: [],
    currentTabTransactions: [],
    upcomingTabTransactions: [],
    allTabTransactions: [],
    overdueTransactions: [],
    upcomingTransactions: [],
    totalPaidThisYear: 0,
    pendingPayments: 0,
    overduePayments: 0,
    upcomingPayments: 0,
  };

  try {
    filterResults = computeTransactionFilters(
      safeTransactions,
      searchTerm,
      typeFilter,
    );
  } catch (err) {
    console.error("Error computing filters:", err);
  }

  const {
    allTabTransactions,
    pastTabTransactions,
    currentTabTransactions,
    upcomingTabTransactions,
    totalPaidThisYear,
    pendingPayments,
    overduePayments,
    upcomingPayments,
  } = filterResults;

  const stats = [
    {
      icon: TrendingUp,
      label: "Total Paid This Year",
      value: `₹${totalPaidThisYear.toLocaleString()}`,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Clock,
      label: "Pending Payments",
      value: `₹${pendingPayments.toLocaleString()}`,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      icon: AlertCircle,
      label: "Overdue",
      value: `₹${overduePayments.toLocaleString()}`,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      icon: Calendar,
      label: "Upcoming (3mo)",
      value: `₹${upcomingPayments.toLocaleString()}`,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Transactions | PropGrowthX</title>
        <meta
          name="description"
          content="View and manage your property transactions, rent payments, and payment history."
        />
      </Helmet>

      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* ─── MOBILE-ONLY: floating hamburger button ─── */}
        <button
          className="md:hidden fixed top-3 left-3 z-50 w-10 h-10 flex items-center justify-center
            bg-white border border-gray-200 rounded-xl shadow-md
            transition-all duration-200 hover:bg-gray-50"
          style={{ display: sidebarOpen ? "none" : undefined }}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>

        {/* ─── MOBILE-ONLY: backdrop (closes drawer on tap) ─── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ─── MOBILE-ONLY: full drawer (slides in over content) ─── */}
        <aside
          className={`md:hidden fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-40
            flex flex-col transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="w-8 h-8 flex-shrink-0"
              />
              <span className="text-base font-bold text-gray-900 whitespace-nowrap">
                PropGrowthX
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <SidebarItem
              icon={BarChart3}
              label="Dashboard"
              sidebarOpen
              onClick={() => {
                navigate("/dashboard/tenant");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Home}
              label="My Properties"
              sidebarOpen
              onClick={() => {
                navigate("/properties");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={DollarSign}
              label="Transactions"
              sidebarOpen
              active
              onClick={() => setSidebarOpen(false)}
            />
            <SidebarItem
              icon={FileText}
              label="Complaints"
              sidebarOpen
              onClick={() => {
                navigate("/dashboard/tenant/complaints");
                setSidebarOpen(false);
              }}
            />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-1">
            <SidebarItem
              icon={User}
              label="Profile"
              sidebarOpen
              onClick={() => {
                navigate("/profile");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={HelpCircle}
              label="Support"
              sidebarOpen
              onClick={() => {
                navigate("/dashboard/tenant/support");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              sidebarOpen
              onClick={() => {
                navigate("/profile#settings");
                setSidebarOpen(false);
              }}
            />
            <SidebarItem
              icon={LogOut}
              label="Logout"
              sidebarOpen
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
            />
          </div>
        </aside>

        {/* ─── DESKTOP/TABLET SIDEBAR — inline in flex row ─── */}
        <aside
          className={`hidden md:flex ${
            sidebarOpen ? "w-64" : "w-20"
          } bg-white border-r border-gray-200 transition-all duration-300 z-40 flex-col md:relative flex-shrink-0`}
        >
          <div className="flex items-center justify-between h-20 px-4 border-b border-gray-200">
            {sidebarOpen ? (
              <div className="flex items-center gap-3 flex-1">
                <img
                  src="/logo.png"
                  alt="Logo"
                  className="w-10 h-10 flex-shrink-0"
                />
                <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
                  PropGrowthX
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Expand sidebar"
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            )}
            {sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
                aria-label="Collapse sidebar"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
          <nav className="flex-1 px-2 py-6 space-y-2 overflow-y-auto">
            <SidebarItem
              icon={BarChart3}
              label="Dashboard"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/dashboard/tenant")}
            />
            <SidebarItem
              icon={Home}
              label="My Properties"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/properties")}
            />
            <SidebarItem
              icon={DollarSign}
              label="Transactions"
              sidebarOpen={sidebarOpen}
              active
            />
            <SidebarItem
              icon={FileText}
              label="Complaints"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/dashboard/tenant/complaints")}
            />
          </nav>
          <div className="px-2 py-4 border-t border-gray-200 space-y-2">
            <SidebarItem
              icon={User}
              label="Profile"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/profile")}
            />
            <SidebarItem
              icon={HelpCircle}
              label="Support"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/dashboard/tenant/support")}
            />
            <SidebarItem
              icon={Settings}
              label="Settings"
              sidebarOpen={sidebarOpen}
              onClick={() => navigate("/profile#settings")}
            />
            <SidebarItem
              icon={LogOut}
              label="Logout"
              sidebarOpen={sidebarOpen}
              onClick={() => {
                sessionStorage.clear();
                window.location.href = "/";
              }}
            />
          </div>
        </aside>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-y-auto min-w-0">
          <div className="min-h-screen bg-white">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Inter:wght@500;600;700;800&display=swap');
              :root { --brand-red: #DC2626; --muted: #6b7280; --card-border: rgba(16,24,40,0.06); --soft-bg: #fbfbfd; --glass: rgba(255,255,255,0.78); }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
              @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
              .tx-page-title { font-family: 'Inter','Geist',system-ui,sans-serif; font-size: clamp(36px,4.5vw,56px); font-weight: 400; letter-spacing: -1.5px; line-height: 1.1; color: #0b1220; margin: 0; animation: slideInLeft 0.7s ease-out 0.1s both; }
              @media (max-width: 640px) { .tx-page-title { font-size: clamp(24px,5vw,42px); } }
              .tx-title-accent { color: var(--brand-red); font-weight: 700; animation: slideInRight 0.7s ease-out 0.2s both; display: inline-block; }
              .tx-container-custom { max-width: 1400px; margin: 0 auto; padding: 24px 32px; }
              @media (max-width: 768px) { .tx-container-custom { padding: 16px 20px; } }
              @media (max-width: 640px) { .tx-container-custom { padding: 12px 16px; } }
              .tx-header-hero { position: relative; padding: 32px 40px 36px; border-radius: 20px; background: linear-gradient(180deg,#FFF5F5 0%,#FFE4E6 100%); border: 1px solid rgba(220,38,38,0.12); animation: fadeInUp 0.8s ease-out 0s both; }
              @media (max-width: 768px) { .tx-header-hero { padding: 20px 24px 24px; border-radius: 16px; } }
              @media (max-width: 640px) { .tx-header-hero { padding: 16px 18px 20px; border-radius: 12px; } }
              .tx-header-hero::after { content: ''; position: absolute; inset: 0; border-radius: 16px; pointer-events: none; box-shadow: 0 20px 50px rgba(2,6,23,0.05); }
              .tx-header-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
              @media (max-width: 640px) { .tx-header-title-row { flex-direction: column; gap: 12px; } }
              .tx-header-subtitle { font-size: 16px; color: var(--muted); font-weight: 400; letter-spacing: 0.2px; line-height: 1.6; margin-top: 12px; animation: fadeInUp 0.8s ease-out 0.25s both; }
              @media (max-width: 768px) { .tx-header-subtitle { font-size: 14px; margin-top: 10px; } }
              @media (max-width: 640px) { .tx-header-subtitle { font-size: 12px; margin-top: 8px; line-height: 1.5; } }
              .tx-divider-line { height: 1px; background: linear-gradient(90deg,rgba(220,38,38,0),rgba(220,38,38,0.3) 20%,rgba(220,38,38,0.5) 50%,rgba(220,38,38,0.3) 80%,rgba(220,38,38,0)); width: 100%; margin-top: 22px; animation: fadeInUp 0.8s ease-out 0.35s both; position: relative; }
              @media (max-width: 640px) { .tx-divider-line { margin-top: 14px; } }
              .tx-export-btn { display: inline-flex; align-items: center; gap: 8px; background: var(--brand-red); border: none; border-radius: 10px; padding: 10px 16px; cursor: pointer; transition: transform .16s ease,box-shadow .16s ease; font-weight: 600; color: white; animation: slideInRight 0.7s ease-out 0.1s both; }
              @media (max-width: 640px) { .tx-export-btn { width: 100%; justify-content: center; padding: 8px 12px; font-size: 12px; gap: 6px; } }
              .tx-export-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(220,38,38,0.25); }
              .tx-export-btn svg { width: 16px; height: 16px; }
              .stats-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(250px,1fr)); gap: 16px; }
              @media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2,1fr); gap: 12px; } }
              @media (max-width: 640px) { .stats-grid { grid-template-columns: 1fr; gap: 10px; } }
              .stat-card { background: white; border: 1px solid #e5e7eb; border-radius: 14px; padding: 16px; transition: all 0.3s ease; }
              @media (max-width: 768px) { .stat-card { border-radius: 12px; padding: 14px; } }
              @media (max-width: 640px) { .stat-card { border-radius: 10px; padding: 12px; } }
              .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
              .stat-card-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
              .stat-label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.3px; }
              @media (max-width: 640px) { .stat-label { font-size: 10px; } }
              .stat-value { font-size: 20px; font-weight: 700; color: #111827; margin-top: 4px; }
              @media (max-width: 640px) { .stat-value { font-size: 16px; } }
              .stat-icon { width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
              @media (max-width: 640px) { .stat-icon { width: 32px; height: 32px; border-radius: 6px; } }
              .tx-card-container { background: white; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
              @media (max-width: 768px) { .tx-card-container { border-radius: 14px; } }
              @media (max-width: 640px) { .tx-card-container { border-radius: 12px; } }
              .tx-card-header { padding: 20px 24px; border-bottom: 1px solid #f3f4f6; }
              @media (max-width: 768px) { .tx-card-header { padding: 16px 20px; } }
              @media (max-width: 640px) { .tx-card-header { padding: 12px 14px; } }
              .tabs-and-filters { display: flex; flex-direction: column; gap: 16px; }
              @media (max-width: 768px) { .tabs-and-filters { gap: 12px; } }
              @media (max-width: 640px) { .tabs-and-filters { gap: 10px; } }
              .filters-row { display: flex; flex-direction: column; gap: 8px; }
              @media (min-width: 640px) { .filters-row { flex-direction: row; } }
              .cta-section { background: linear-gradient(to right,#fef2f2,#fff5f2); border: 2px solid #fca5a5; border-radius: 16px; padding: 24px; margin-top: 24px; }
              @media (max-width: 768px) { .cta-section { border-radius: 14px; padding: 16px; margin-top: 16px; } }
              @media (max-width: 640px) { .cta-section { border-radius: 12px; padding: 12px; margin-top: 12px; } }
              .cta-content { display: flex; gap: 16px; align-items: flex-start; }
              @media (max-width: 640px) { .cta-content { gap: 12px; } }
              .cta-icon { width: 32px; height: 32px; border-radius: 8px; background: rgba(239,68,68,0.1); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
              .cta-text h3 { font-size: 18px; font-weight: 700; color: #7f1d1d; margin: 0 0 8px 0; }
              @media (max-width: 640px) { .cta-text h3 { font-size: 16px; margin-bottom: 6px; } }
              .cta-text p { font-size: 14px; color: #b91c1c; margin: 0 0 12px 0; line-height: 1.5; }
              @media (max-width: 640px) { .cta-text p { font-size: 12px; margin-bottom: 10px; } }
              .cta-button { background: #dc2626; color: white; border: none; border-radius: 8px; padding: 8px 16px; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.3s ease; }
              @media (max-width: 640px) { .cta-button { width: 100%; padding: 8px 12px; font-size: 12px; } }
              .cta-button:hover { background: #b91c1c; }
            `}</style>

            <section className="relative bg-white pt-12 pb-0 overflow-hidden">
              <div
                className={`tx-container-custom relative z-10 ${!sidebarOpen ? "md:pl-8" : ""}`}
              >
                <div className="pb-4">
                  <div className="tx-header-hero">
                    <div className="tx-header-title-row">
                      <div className="max-w-3xl flex-1">
                        <h1 className="tx-page-title mb-3">
                          Track your
                          <br />
                          <span className="tx-title-accent">
                            payment history
                          </span>
                        </h1>
                        <p className="tx-header-subtitle">
                          Stay on top of your rent payments. Manage all
                          transactions, monitor payment status, and download
                          receipts with ease.
                        </p>
                      </div>
                      <button className="tx-export-btn flex-shrink-0">
                        <Download />
                        <span>Export</span>
                      </button>
                    </div>
                    <div className="tx-divider-line" />
                  </div>
                </div>
              </div>
            </section>

            <section className="py-2 bg-gray-50">
              <div className="tx-container-custom">
                <div className="stats-grid">
                  {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                      <div key={idx} className="stat-card">
                        <div className="stat-card-header">
                          <div>
                            <p className="stat-label">{stat.label}</p>
                            <p className="stat-value">{stat.value}</p>
                          </div>
                          <div className={`stat-icon ${stat.bgColor}`}>
                            <Icon
                              className={`w-5 h-5 ${stat.color}`}
                              strokeWidth={1.5}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            <section className="py-6 bg-white">
              <div className="tx-container-custom">
                <div className="tx-card-container">
                  <div className="tx-card-header">
                    <div className="tabs-and-filters">
                      <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="w-full"
                      >
                        <div className="flex flex-col gap-4">
                          <TabsList className="bg-gray-100 p-1 rounded-lg flex-shrink-0 w-full justify-start overflow-x-auto">
                            <TabsTrigger
                              value="all"
                              className="px-3 py-1.5 text-xs font-medium"
                            >
                              All
                            </TabsTrigger>
                            <TabsTrigger
                              value="past"
                              className="px-3 py-1.5 text-xs font-medium"
                            >
                              Past
                            </TabsTrigger>
                            <TabsTrigger
                              value="current"
                              className="px-3 py-1.5 text-xs font-medium"
                            >
                              Current
                            </TabsTrigger>
                            <TabsTrigger
                              value="upcoming"
                              className="px-3 py-1.5 text-xs font-medium"
                            >
                              Upcoming
                            </TabsTrigger>
                          </TabsList>
                          <div className="filters-row">
                            <div className="relative flex-1">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 border-gray-200 focus-visible:ring-red-600 focus-visible:ring-offset-0 rounded-lg h-9 bg-gray-50 text-sm"
                              />
                            </div>
                            <Select
                              value={typeFilter}
                              onValueChange={setTypeFilter}
                            >
                              <SelectTrigger className="border-gray-200 focus:ring-red-600 rounded-lg bg-gray-50 h-9 w-full sm:w-40 text-sm">
                                <SelectValue placeholder="Type" />
                              </SelectTrigger>
                              <SelectContent className="rounded-lg border-gray-200">
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="rent">Rent</SelectItem>
                                <SelectItem value="deposit">Deposit</SelectItem>
                                <SelectItem value="maintenance">
                                  Maintenance
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </Tabs>
                    </div>
                  </div>
                  <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsContent value="all" className="mt-0">
                      <TransactionTable transactions={allTabTransactions} />
                    </TabsContent>
                    <TabsContent value="past" className="mt-0">
                      <TransactionTable transactions={pastTabTransactions} />
                    </TabsContent>
                    <TabsContent value="current" className="mt-0">
                      <TransactionTable transactions={currentTabTransactions} />
                    </TabsContent>
                    <TabsContent value="upcoming" className="mt-0">
                      <TransactionTable
                        transactions={upcomingTabTransactions}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                {allTabTransactions.length === 0 && (
                  <div className="mt-6 bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Building2
                        className="w-7 h-7 text-gray-400"
                        strokeWidth={1.5}
                      />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      No Transactions Found
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto text-sm">
                      You don't have any transactions yet. Once you start
                      renting, your payment history will appear here.
                    </p>
                  </div>
                )}
              </div>
            </section>

            {overduePayments > 0 && (
              <section className="py-6 bg-gray-50">
                <div className="tx-container-custom">
                  <div className="cta-section">
                    <div className="cta-content">
                      <div className="cta-icon">
                        <AlertCircle
                          className="w-5 h-5 text-red-600"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="cta-text flex-1">
                        <h3>Action Required</h3>
                        <p>
                          You have overdue payments totaling{" "}
                          <span className="font-bold">
                            ₹{overduePayments.toLocaleString()}
                          </span>
                          . Please pay soon.
                        </p>
                        <button className="cta-button">Pay Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

const SidebarItem = ({
  icon: Icon,
  label,
  active = false,
  onClick,
  sidebarOpen = true,
}: {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
  sidebarOpen?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-base ${
      active
        ? "bg-red-50 text-red-600 font-semibold"
        : "text-gray-700 hover:bg-gray-50 font-medium"
    }`}
    title={!sidebarOpen ? label : ""}
  >
    <Icon className="w-6 h-6 flex-shrink-0" />
    {sidebarOpen && <span>{label}</span>}
  </button>
);

export default TenantTransactions;
