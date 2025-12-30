import React, { useState, useEffect, useMemo } from "react";
import {
  Registration,
  RegistrationType,
  SortOrder,
  ColumnVisibility,
} from "./types";
import { fetchRegistrations } from "./api/adminApi";
import StatCard from "../components/StatCard";
import {
  UsersIcon,
  GraduateIcon,
  BriefcaseIcon,
  SearchIcon,
  CopyIcon,
  ChevronDownIcon,
  EyeIcon,
} from "../components/Icons";

const App: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] =
    useState<RegistrationType | "All">("All");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [columns, setColumns] = useState<ColumnVisibility>({
    phone: true,
    company: true,
    date: true,
  });
  const [showColumnMenu, setShowColumnMenu] = useState(false);

  // Toast
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info";
  } | null>(null);

  // Fetch data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchRegistrations();
        setRegistrations(data);
        setError(null);
      } catch {
        setError("Connection to applicant database interrupted.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Toast helpers
  const showToast = (
    message: string,
    type: "success" | "info" = "success"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const copyToClipboard = (text?: string, label?: string) => {
    if (!text || !label) return;
    navigator.clipboard.writeText(text);
    showToast(`${label} copied!`);
  };

  // Stats
  const stats = useMemo(() => {
    return {
      total: registrations.length,
      students: registrations.filter(
        (r) => r.registration_type === RegistrationType.STUDENT
      ).length,
      professionals: registrations.filter(
        (r) => r.registration_type === RegistrationType.PROFESSIONAL
      ).length,
    };
  }, [registrations]);

  // Filter + sort
  const filteredData = useMemo(() => {
    let result = registrations.filter((reg) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        reg.name.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query);
      const matchesType =
        typeFilter === "All" || reg.registration_type === typeFilter;
      return matchesSearch && matchesType;
    });

    result.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [registrations, searchQuery, typeFilter, sortOrder]);

  const tableContentKey = `${typeFilter}-${sortOrder}-${searchQuery}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50">
          <div
            className={`px-5 py-3 rounded-2xl shadow-xl text-white font-semibold ${
              toast.type === "success"
                ? "bg-emerald-600"
                : "bg-slate-900"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <div className="bg-emerald-600 p-3 rounded-2xl">
            <UsersIcon className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">
              AI for Humanity Summit 2025
            </h1>
            <p className="text-sm text-slate-500">
              Admin Portal · Impact Collaborative
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-10">
        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <StatCard
            label="Total Applicants"
            value={stats.total}
            icon={<UsersIcon />}
            loading={loading}
          />
          <StatCard
            label="Student Track"
            value={stats.students}
            icon={<GraduateIcon />}
            loading={loading}
          />
          <StatCard
            label="Professional Track"
            value={stats.professionals}
            icon={<BriefcaseIcon />}
            loading={loading}
          />
        </div>

        {/* SEARCH + FILTER CONTROLS (RESTORED UI) */}
        <div className="bg-white p-5 rounded-3xl border mb-8 flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[260px]">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border"
              placeholder="Search by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          {(["All", RegistrationType.STUDENT, RegistrationType.PROFESSIONAL] as const).map(
            (type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-5 py-2 rounded-xl text-xs font-bold uppercase ${
                  typeFilter === type
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {type}
              </button>
            )
          )}

          {/* Sort */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrder)}
            className="px-4 py-2 rounded-xl bg-slate-50 border"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-3xl border overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">Applicant</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody key={tableContentKey}>
              {filteredData.map((reg) => (
                <tr key={reg._id} className="border-t hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-bold">{reg.name}</div>
                    <div className="text-sm text-slate-500">{reg.email}</div>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold">
                    {reg.registration_type}
                  </td>
                  <td className="px-6 py-4">{reg.company || "—"}</td>
                  <td className="px-6 py-4">{reg.phone || "—"}</td>
                  <td className="px-6 py-4">
                    {new Date(reg.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Error Overlay */}
      {error && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-white p-8 rounded-2xl text-center max-w-md">
            <h2 className="text-xl font-bold mb-4">Connection Error</h2>
            <p className="mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-slate-900 text-white rounded-xl"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
