import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import { HiPencil, HiTrash, HiPlusCircle } from "react-icons/hi";

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/events/admin/all");
      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event deleted");
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Events</h1>
        <Link
          to="/admin/events/create"
          className="btn-primary flex items-center gap-2"
        >
          <HiPlusCircle /> New Event
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No events yet. Create your first event.
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100">
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Seats</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id} className="border-b border-gray-50 last:border-0">
                  <td className="p-4 font-medium text-gray-900">
                    {event.title}
                  </td>
                  <td className="p-4 text-gray-600">{event.category}</td>
                  <td className="p-4 text-gray-600">
                    {format(new Date(event.date), "dd MMM yyyy")}
                  </td>
                  <td className="p-4 text-gray-600">
                    {event.seatsAvailable}/{event.totalSeats}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        event.isPublished
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {event.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/admin/events/${event._id}/edit`}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
                        title="Edit"
                      >
                        <HiPencil />
                      </Link>
                      <button
                        onClick={() => handleDelete(event._id)}
                        className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                        title="Delete"
                      >
                        <HiTrash />
                      </button>
                    </div>
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

export default ManageEvents;
