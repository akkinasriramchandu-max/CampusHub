import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { HiTrash } from "react-icons/hi";

const ManageAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", message: "", event: "" });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [announcementsRes, eventsRes] = await Promise.all([
        api.get("/announcements"),
        api.get("/events/admin/all"),
      ]);
      setAnnouncements(announcementsRes.data);
      setEvents(eventsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, event: form.event || undefined };
      await api.post("/announcements", payload);
      toast.success("Announcement published");
      setForm({ title: "", message: "", event: "" });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await api.delete(`/announcements/${id}`);
      toast.success("Announcement deleted");
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Announcements
        </h1>
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">
            Publish New Announcement
          </h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                value={form.message}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Related Event (optional)
              </label>
              <select
                name="event"
                value={form.event}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">None</option>
                {events.map((ev) => (
                  <option key={ev._id} value={ev._id}>
                    {ev.title}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full"
            >
              {submitting ? "Publishing..." : "Publish"}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="font-semibold text-gray-900 mb-4 lg:mt-16">
          Published Announcements
        </h2>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
          </div>
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a._id} className="card p-4 flex justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">{a.title}</h3>
                    <span className="text-xs text-gray-400">
                      {format(new Date(a.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                  {a.event && (
                    <span className="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      {a.event.title}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(a._id)}
                  className="p-2 h-fit rounded-lg hover:bg-red-50 text-red-600 shrink-0"
                  title="Delete"
                >
                  <HiTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAnnouncements;
