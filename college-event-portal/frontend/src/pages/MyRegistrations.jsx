import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { HiCalendar, HiLocationMarker } from "react-icons/hi";

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/registrations/my");
      setRegistrations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (eventId) => {
    try {
      await api.delete(`/registrations/${eventId}`);
      toast.success("Registration cancelled");
      fetchRegistrations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        My Registrations
      </h1>

      {registrations.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          You haven't registered for any events yet.{" "}
          <Link to="/events" className="text-primary-600 font-medium">
            Browse events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg) => (
            <div
              key={reg._id}
              className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <Link
                  to={`/events/${reg.event?._id}`}
                  className="font-semibold text-gray-900 hover:text-primary-600"
                >
                  {reg.event?.title || "Event removed"}
                </Link>
                {reg.event && (
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <span className="flex items-center gap-1">
                      <HiCalendar className="text-primary-600" />
                      {format(new Date(reg.event.date), "dd MMM yyyy")}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiLocationMarker className="text-primary-600" />
                      {reg.event.venue}
                    </span>
                  </div>
                )}
              </div>
              {reg.event && (
                <button
                  onClick={() => handleCancel(reg.event._id)}
                  className="btn-danger shrink-0"
                >
                  Cancel
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
