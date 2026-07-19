import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import {
  HiCalendar,
  HiUsers,
  HiSpeakerphone,
  HiPlusCircle,
} from "react-icons/hi";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalAnnouncements: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, regsRes, announcementsRes] = await Promise.all([
          api.get("/events/admin/all"),
          api.get("/registrations"),
          api.get("/announcements"),
        ]);
        setStats({
          totalEvents: eventsRes.data.length,
          totalRegistrations: regsRes.data.length,
          totalAnnouncements: announcementsRes.data.length,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Manage Events",
      icon: HiCalendar,
      desc: "Create, edit and delete events",
      to: "/admin/events",
      stat: stats.totalEvents,
      statLabel: "total events",
    },
    {
      label: "Registrations",
      icon: HiUsers,
      desc: "View all student registrations",
      to: "/admin/registrations",
      stat: stats.totalRegistrations,
      statLabel: "total registrations",
    },
    {
      label: "Announcements",
      icon: HiSpeakerphone,
      desc: "Publish updates to students",
      to: "/admin/announcements",
      stat: stats.totalAnnouncements,
      statLabel: "total announcements",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-500 mt-1">
            Manage events, registrations and announcements
          </p>
        </div>
        <Link to="/admin/events/create" className="btn-primary flex items-center gap-2">
          <HiPlusCircle /> New Event
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              className="card p-6 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center mb-4">
                <c.icon className="text-primary-600" size={22} />
              </div>
              <h3 className="font-semibold text-gray-900">{c.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{c.desc}</p>
              <p className="text-2xl font-bold text-primary-600 mt-4">
                {c.stat}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  {c.statLabel}
                </span>
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
