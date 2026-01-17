import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import debounce from "lodash.debounce";
import { UserDataContext } from "../context/UserContext";
import LeadAnalytics from "./LeadAnalyticsModal";
import LeadAnalyticsModal from "./LeadAnalyticsModal";



export default function LeadsList() {
  const navigate = useNavigate();

  /* ===================== STATE ===================== */
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(false);

  // search (auto)
  const [search, setSearch] = useState("");

  // filters
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // pagination
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // UI
  const [showFilters, setShowFilters] = useState(false);

  const { serverUrl } = useContext(UserDataContext);
  const [showAnalytics, setShowAnalytics] = useState(false);



  /* ===================== HELPERS ===================== */
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /* ===================== API ===================== */
  const fetchLeads = async ({
    searchValue = search,
    statusValue = status,
    sourceValue = source,
    sortOrderValue = sortOrder,
    pageValue = page,
  } = {}) => {
    try {
      setLoading(true);

      const res = await axios.get(`${serverUrl}/api/leads`, {
        params: {
          search: searchValue,
          status: statusValue,
          source: sourceValue,
          sortBy: "createdAt",
          sortOrder: sortOrderValue,
          page: pageValue,
          limit,
        },
        withCredentials: true,
      });

      setLeads(res.data.data);
      setTotalPages(res.data.pagination.pages);
    } catch (err) {
      console.error("Error fetching leads", err);
    } finally {
      setLoading(false);
    }
  };

  /* ===================== DEBOUNCED SEARCH ===================== */
  const debouncedSearch = useCallback(
    debounce((value) => {
      setPage(1);
      fetchLeads({
        searchValue: value,
        pageValue: 1,
      });
    }, 500),
    [status, source, sortOrder]
  );


  useEffect(() => {
    debouncedSearch(search);
    return () => debouncedSearch.cancel();
  }, [search]);

  /* ===================== PAGE CHANGE ===================== */
  useEffect(() => {
    fetchLeads();
  }, [page]);

  /* ===================== FILTER ACTIONS ===================== */
  const applyFilters = () => {
    setPage(1);
    fetchLeads();
    setShowFilters(false);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("");
    setSource("");
    setSortOrder("desc");
    setPage(1);
    setShowFilters(false);

    // ✅ explicit clean call (no stale state)
    fetchLeads({
      searchValue: "",
      statusValue: "",
      sourceValue: "",
      sortOrderValue: "desc",
      pageValue: 1,
    });
  };


  /* ===================== BADGE COLORS ===================== */
  const statusColor = {
    New: "bg-blue-100 text-blue-800",
    Contacted: "bg-yellow-100 text-yellow-800",
    Qualified: "bg-purple-100 text-purple-800",
    Converted: "bg-green-100 text-green-800",
    Lost: "bg-red-100 text-red-800",
  };

  const sourceColor = {
    Website: "bg-indigo-100 text-indigo-800",
    Facebook: "bg-blue-100 text-blue-800",
    Referral: "bg-green-100 text-green-800",
    LinkedIn: "bg-sky-100 text-sky-800",
    Other: "bg-gray-100 text-gray-800",
  };

  /* ===================== UI ===================== */
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Leads Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Search, filter and manage your leads
            </p>
          </div>

          <button
            onClick={() => setShowAnalytics(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            View Analytics
          </button>
        </div>


        {/* SEARCH + FILTER ICON */}
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name, email or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <svg
                className="absolute left-3 top-3 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                />
              </svg>
            </div>

            {/* FILTER BUTTON */}
            <button
              onClick={() => setShowFilters((p) => !p)}
              className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 border rounded-md bg-gray-50 hover:bg-gray-100"
            >
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 12.414V19a1 1 0 01-.553.894l-4 2A1 1 0 019 21v-8.586L3.293 6.707A1 1 0 013 6V4z"
                />
              </svg>
              <span className="hidden md:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-[500px] opacity-100 mb-6" : "max-h-0 opacity-0"
            }`}
        >
          <div className="bg-white rounded-lg shadow p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* STATUS */}
              <div>
                <label className=" text-sm font-medium  mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Converted">Converted</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* SOURCE */}
              <div>
                <label className=" text-sm font-medium  mb-1">
                  Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">All</option>
                  <option value="Website">Website</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Referral">Referral</option>
                  <option value="LinkedIn">LinkedIn</option>
                </select>
              </div>

              {/* SORT */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>

              {/* ACTIONS */}
              <div className="flex items-end gap-2">
                <button
                  onClick={applyFilters}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Apply
                </button>
                <button
                  onClick={resetFilters}
                  className="flex-1 border px-4 py-2 rounded-md hover:bg-gray-50"
                >
                  Reset
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex justify-center py-10 text-gray-600">
            Loading leads...
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && leads.length === 0 && (
          <div className="bg-white rounded-lg shadow p-10 text-center text-gray-500">
            No leads found
          </div>
        )}

        {/* LEADS LIST */}
        <div className="space-y-4">
          {leads.map((lead) => (
            <div
              key={lead._id}
              onClick={() => navigate(`/leads/${lead._id}`)}
              className="bg-white rounded-lg shadow hover:shadow-lg transition p-6 cursor-pointer"
            >
              <div className="flex flex-col lg:flex-row justify-between gap-4">

                {/* LEFT */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {lead.name}
                  </h3>
                  <p className="text-gray-600">{lead.email}</p>
                  {lead.company && (
                    <p className="text-sm text-gray-500">{lead.company}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    Created on {formatDate(lead.createdAt)}
                  </p>
                </div>

                {/* RIGHT BADGES */}
                <div className="bg-gray-50 rounded-lg px-3 py-2 flex flex-row lg:flex-col gap-2 items-start lg:items-end">
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${statusColor[lead.status]}`}
                  >
                    {lead.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${sourceColor[lead.source]}`}
                  >
                    {lead.source}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-between items-center bg-white p-4 rounded-lg shadow">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {/* ANALYTICS MODAL */}
        <LeadAnalyticsModal
          isOpen={showAnalytics}
          onClose={() => setShowAnalytics(false)}
        />


      </div>
    </div>
  );
}
