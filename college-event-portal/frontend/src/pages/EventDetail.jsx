import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import {
  HiCalendar,
  HiLocationMarker,
  HiUsers,
  HiClock,
} from "react-icons/hi";

const EventDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
    } catch (error) {
      toast.error("Event not found");
      navigate("/events");
    } finally {
      setLoading(false);
    }
  };

  const checkRegistration = async () => {
    if (!user || user.role !== "student") return;
    try {
      const { data } = await api.get("/registrations/my");
      setIsRegistered(data.some((r) => r.event && r.event._id === id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEvent();
    checkRegistration();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegister = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/registrations/${id}`);
      toast.success("Successfully registered!");
      setIsRegistered(true);
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setActionLoading(true);
    try {
      await api.delete(`/registrations/${id}`);
      toast.success("Registration cancelled");
      setIsRegistered(false);
      fetchEvent();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancellation failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!event) return null;

  const isOpen =
    event.seatsAvailable > 0 &&
    new Date() < new Date(event.registrationDeadline);

  return (
    <div className="max-w-3xl mx-auto">
      <Link to="/events" className="text-primary-600 text-sm font-medium">
        &larr; Back to events
      </Link>

      <div className="card overflow-hidden mt-4">
        <div className="h-56 bg-gradient-to-br from-primary-500 to-primary-700 relative">
          {event.bannerImage ? (
            <img
              src={event.bannerImage}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold opacity-30">
              {event.title.charAt(0)}
            </div>
          )}
          <span className="absolute top-4 left-4 text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-primary-700">
            {event.category}
          </span>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
          <p className="text-gray-600 mt-3 whitespace-pre-line">
            {event.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <HiCalendar className="text-primary-600" />
              {format(new Date(event.date), "EEEE, dd MMM yyyy")}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <HiClock className="text-primary-600" />
              {event.time}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <HiLocationMarker className="text-primary-600" />
              {event.venue}
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <HiUsers className="text-primary-600" />
              {event.seatsAvailable} / {event.totalSeats} seats available
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            Registration deadline:{" "}
            <span className="font-medium text-gray-700">
              {format(new Date(event.registrationDeadline), "dd MMM yyyy, hh:mm a")}
            </span>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            {!user ? (
              <button onClick={() => navigate("/login")} className="btn-primary">
                Login to Register
              </button>
            ) : user.role === "admin" ? (
              <p className="text-sm text-gray-500">
                Admins cannot register for events.
              </p>
            ) : isRegistered ? (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="btn-danger"
              >
                {actionLoading ? "Cancelling..." : "Cancel Registration"}
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={!isOpen || actionLoading}
                className="btn-primary"
              >
                {!isOpen
                  ? "Registration Closed"
                  : actionLoading
                  ? "Registering..."
                  : "Register for this Event"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
