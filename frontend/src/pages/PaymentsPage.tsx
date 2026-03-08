import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import {
  ArrowLeft,
  Download,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useData } from "@/context/dataContext";

export interface Transaction {
  id: number;
  created_at: string;
  tenant_id?: string;
  owner_id?: string;
  tenant_name?: string;
  property_name?: string;
  property_id: string;
  type: "rent" | "fee";
  amount: string | number;
  status: "completed" | "pending" | "overdue" | "upcoming";
  payment_method?: string;
}

export default function PaymentsPage() {
  const { transactions } = useData();
  console.log(transactions);

  const today = new Date();

  function getTotalOverdue(transactions: any[], today = new Date()) {
    const overdue = transactions
      ?.filter((t: any) => new Date(t.due_date) < today)
      .map((t: any) => Number(t.amount));

    return overdue.reduce((sum: number, amount: number) => sum + amount, 0);
  }

  const totalOverdue = useMemo(() => {
    return getTotalOverdue(transactions);
  }, [transactions]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const kpis = useMemo(() => {
    let pending = 0;
    let collected = 0;
    let completedCount = 0;

    transactions.forEach((t) => {
      const amount = Number(t.amount) || 0;

      if (t.status === "completed") {
        collected += amount;
        completedCount++;
      } else {
        pending += amount;
      }
    });

    const totalTransactions = transactions.length;

    const successRate =
      totalTransactions > 0
        ? ((completedCount / totalTransactions) * 100).toFixed(1)
        : "0";

    return {
      pending,
      collected,
      successRate,
      totalTransactions,
    };
  }, [transactions]);

  // ================= FILTER LOGIC =================
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.property_name?.toLowerCase().includes(query.toLowerCase()) ||
        t.tenant_name?.toLowerCase().includes(query.toLowerCase()) ||
        t.type?.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === "all" || t.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, query, statusFilter]);

  return (
    <>
      <Helmet>
        <title>Payment Management | PropGrowthX</title>
      </Helmet>

      <Layout>
        <div className="min-h-screen bg-white">
          {/* HEADER */}
          <div className="border-b border-gray-100">
            <div className="container-custom py-8">
              <a
                href="/dashboard/owner"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </a>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Payment Management
              </h1>
            </div>
          </div>

          <div className="container-custom py-12">
            {/* ================= KPI SECTION ================= */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Pending */}
              <div className="bg-white border rounded-xl p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 uppercase">
                    Pending
                  </span>
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-3xl font-bold">
                  ₹ {kpis.pending.toLocaleString()}
                </div>
              </div>

              {/* Overdue (not calculated deeply yet) */}
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 uppercase">
                    Overdue
                  </span>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div className="text-3xl font-bold text-red-600">
                  {totalOverdue}
                </div>
              </div>

              {/* Collected */}
              <div className="bg-white border rounded-xl p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 uppercase">
                    Collected
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  ₹ {kpis.collected.toLocaleString()}
                </div>
              </div>

              {/* Success Rate */}
              <div className="bg-white border rounded-xl p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-600 uppercase">
                    Success Rate
                  </span>
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">
                  {kpis.successRate}%
                </div>
              </div>
            </div>

            {/* ================= FILTERS ================= */}
            <div className="flex gap-4 mb-8">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
                className="border px-4 py-2 rounded-lg w-full"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border px-4 py-2 rounded-lg"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="upcoming">Upcoming</option>
              </select>
            </div>

            {/* ================= TABLE ================= */}
            <div className="bg-white border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b bg-gray-50 flex justify-between">
                <h3 className="font-semibold">Payment Transactions</h3>
                <span className="text-sm text-gray-500">
                  {kpis.totalTransactions} transactions
                </span>
              </div>

              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t) => (
                  <div
                    key={t.id}
                    className="grid grid-cols-1 md:grid-cols-6 gap-4 px-6 py-4 border-b hover:bg-gray-50"
                  >
                    <div>{t.date}</div>

                    <div className="font-medium">
                      {t.property_name || "N/A"}
                    </div>

                    <div>{t.tenant_name || "N/A"}</div>

                    <div className="font-semibold">
                      ₹ {Number(t.amount).toLocaleString()}
                    </div>

                    <div>{t.type.toUpperCase()}</div>

                    <div className="text-right">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          t.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : t.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : t.status === "overdue"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center text-gray-400">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
