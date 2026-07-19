import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import EventCard from "../components/EventCard.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [myRegistrations, setMyRegistrations] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, regsRes, announcementsRes] = await Promise.all([
          api.get("/events", { params: { upcoming: "true" } }),
          api.get("/registrations/my"),
          api.get("/announcements"),
        ]);
        setUpcomingEvents(eventsRes.data.slice(0, 6));
        setMyRegistrations(regsRes.data);
        setAnnouncements(announcementsRes.data.slice(0, 4));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening around campus
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5">
          <p className="text-sm text-gray-500">My Registrations</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">
            {myRegistrations.length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Upcoming Events</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">
            {upcomingEvents.length}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Announcements</p>
          <p className="text-3xl font-bold text-primary-600 mt-1">
            {announcements.length}
          </p>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Upcoming Events
          </h2>
          <Link to="/events" className="text-sm text-primary-600 font-medium">
            View all
          </Link>
        </div>
        {upcomingEvents.length === 0 ? (
          <p className="text-gray-500 text-sm">No upcoming events right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Announcements
          </h2>
          <Link
            to="/announcements"
            className="text-sm text-primary-600 font-medium"
          >
            View all
          </Link>
        </div>
        {announcements.length === 0 ? (
          <p className="text-gray-500 text-sm">No announcements yet.</p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a._id} className="card p-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-900">{a.title}</h3>
                  <span className="text-xs text-gray-400 shrink-0 ml-2">
                    {format(new Date(a.createdAt), "dd MMM")}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{a.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
