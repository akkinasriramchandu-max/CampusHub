import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "../../api/axios.js";

const AdminRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const { data } = await api.get("/registrations");
        setRegistrations(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const filtered = registrations.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.student?.name?.toLowerCase().includes(q) ||
      r.student?.email?.toLowerCase().includes(q) ||
      r.event?.title?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Registrations</h1>
        <input
          type="text"
          placeholder="Search by student or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field sm:w-72"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No registrations found.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Student</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Event</th>
                <th className="p-4 font-medium">Registered On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-gray-50 last:border-0">
                  <td className="p-4 font-medium text-gray-900">
                    {r.student?.name || "Unknown"}
                  </td>
                  <td className="p-4 text-gray-600">{r.student?.email}</td>
                  <td className="p-4 text-gray-600">
                    {r.event?.title || "Event removed"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {format(new Date(r.createdAt), "dd MMM yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRegistrations;
