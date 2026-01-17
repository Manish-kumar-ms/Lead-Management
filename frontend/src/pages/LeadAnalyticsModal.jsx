import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";

export default function LeadAnalyticsModal({ isOpen, onClose }) {
  const { serverUrl } = useContext(UserDataContext);

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // animation state
  const [show, setShow] = useState(false);

  
  useEffect(() => {
    if (isOpen) {
      setShow(true);
      document.body.style.overflow = "hidden"; // lock scroll
    } else {
      document.body.style.overflow = "auto";
      setTimeout(() => setShow(false), 300); // wait for exit animation
    }
  }, [isOpen]);

  /* ===================== ESC KEY SUPPORT ===================== */
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  /* ===================== FETCH ANALYTICS ===================== */
  useEffect(() => {
    if (!isOpen) return;

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${serverUrl}/api/leads/analytics`, {
          withCredentials: true,
        });
        setAnalytics(res.data.data);
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [isOpen, serverUrl]);

  if (!show) return null;

  const conversionRate = analytics?.totalLeads
    ? Math.round((analytics.convertedLeads / analytics.totalLeads) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-40" : "opacity-0"
        }`}
      />

      {/* MODAL */}
      <div
        className={`relative bg-white w-full max-w-3xl mx-4 rounded-xl shadow-xl transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            Lead Analytics
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loading && (
            <p className="text-gray-500 text-center">
              Loading analytics...
            </p>
          )}

          {!loading && analytics && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

              {/* TOTAL */}
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-sm text-gray-500">Total Leads</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {analytics.totalLeads}
                </p>
              </div>

              {/* CONVERTED */}
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-sm text-gray-500">Converted Leads</p>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  {analytics.convertedLeads}
                </p>
              </div>

              {/* RATE */}
              <div className="bg-gray-50 rounded-lg p-5">
                <p className="text-sm text-gray-500">Conversion Rate</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">
                  {conversionRate}%
                </p>
              </div>

              {/* STATUS */}
              <div className="sm:col-span-2 lg:col-span-3 border rounded-lg p-5">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  Leads by Status
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {analytics.leadsByStatus.map((item) => (
                    <div
                      key={item._id}
                      className="flex justify-between bg-gray-50 px-3 py-2 rounded"
                    >
                      <span className="text-sm text-gray-600">
                        {item._id}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end p-4 border-t">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
