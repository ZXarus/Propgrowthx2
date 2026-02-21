import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import {
  ArrowLeft,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import ComplaintList from "@/components/dashboard/ComplaintList";
import { useData } from "@/context/dataContext";
import { Complaint } from "@/components/tenant/AddComplaintModal";

const OwnerComplaints = () => {
  // ✅ Now using real backend complaints
  const { complaints } = useData();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );

  const stats = {
    total: complaints.length,
    open: complaints.filter((c) => c.status === "open").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
    urgent: complaints.filter(
      (c) => c.priority === "urgent" && c.status !== "resolved",
    ).length,
  };

  const resolutionRate =
    stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Manage Complaints | PropGrowthX</title>
        <meta
          name="description"
          content="Manage and respond to tenant complaints and maintenance requests."
        />
      </Helmet>

      {/* <Layout showNavbar={false} showFooter={false}> */}
      <Layout>
        <div className="min-h-screen bg-white">
          <div className="max-w-[1100px] mx-auto px-5 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="bg-gradient-to-b from-red-100/10 to-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <NavLink to="/dashboard/owner">
                  <button className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all px-4 py-2 rounded-lg">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="font-semibold">Back</span>
                  </button>
                </NavLink>

                <h1 className="font-serif text-4xl sm:text-5xl mt-4 text-gray-900 leading-snug">
                  Your complaints,
                  <br />
                  <span className="text-red-600 font-bold">our priority</span>
                </h1>

                <p className="mt-3 text-gray-500 text-sm">
                  Stay on top of tenant issues. Track what's open, respond
                  faster, and close complaints with confidence.
                </p>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-red-400/50 to-transparent mt-6" />
              </div>
            </div>

            {/* Stats */}
            <section className="py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                  icon={<BarChart3 className="text-red-600" />}
                  number={stats.total}
                  label="Total"
                />

                <StatCard
                  icon={<AlertCircle className="text-red-600" />}
                  number={stats.open}
                  label="Open"
                  border="border-yellow-400"
                />

                <StatCard
                  icon={<Clock className="text-red-600" />}
                  number={stats.inProgress}
                  label="In Progress"
                  border="border-teal-400"
                />

                <StatCard
                  icon={<CheckCircle className="text-red-600" />}
                  number={stats.resolved}
                  label="Resolved"
                  border="border-green-400"
                />

                <StatCard
                  icon={<TrendingUp className="text-red-600" />}
                  number={stats.urgent}
                  label="Urgent"
                  border="border-red-500"
                />
              </div>

              {stats.total > 0 && (
                <div className="mt-5 border rounded-xl p-4 flex items-center justify-between shadow-sm bg-white">
                  <div>
                    <div className="text-xs font-bold tracking-wide text-gray-800 uppercase">
                      You've resolved
                    </div>
                    <div className="text-3xl font-extrabold text-red-600 mt-1">
                      {resolutionRate}%
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {stats.resolved} out of {stats.total} complaints
                    </div>

                    <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                        style={{ width: `${resolutionRate}%` }}
                      />
                    </div>
                  </div>

                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center shadow"
                    style={{
                      background: `conic-gradient(#dc2626 ${
                        resolutionRate * 3.6
                      }deg, #e2e8f0 ${resolutionRate * 3.6}deg)`,
                    }}
                  >
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-sm font-bold">
                      {resolutionRate}%
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Complaint List */}
            <div className="mt-6 pb-8">
              <ComplaintList
                complaints={complaints}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                priorityFilter={priorityFilter}
                setPriorityFilter={setPriorityFilter}
                isDetailModalOpen={isDetailModalOpen}
                setIsDetailModalOpen={setIsDetailModalOpen}
                selectedComplaint={selectedComplaint}
                setSelectedComplaint={setSelectedComplaint}
              />
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerComplaints;

const StatCard = ({ icon, number, label, border = "border-gray-200" }) => (
  <div
    className={`flex flex-col gap-3 p-4 border rounded-xl shadow-sm bg-white hover:-translate-y-1 hover:shadow-xl transition-all ${border}`}
  >
    <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-50 border">
      {icon}
    </div>
    <div>
      <div className="text-2xl font-extrabold text-gray-900">{number}</div>
      <div className="text-xs uppercase tracking-wide font-semibold text-gray-500">
        {label}
      </div>
    </div>
  </div>
);
