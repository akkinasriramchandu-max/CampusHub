import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "../api/axios.js";
import { HiSpeakerphone } from "react-icons/hi";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data } = await api.get("/announcements");
        setAnnouncements(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Announcements</h1>

      {announcements.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No announcements yet.
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a._id} className="card p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-50 flex items-center justify-center shrink-0">
                  <HiSpeakerphone className="text-primary-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-900">{a.title}</h3>
                    <span className="text-xs text-gray-400 shrink-0 ml-2">
                      {format(new Date(a.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{a.message}</p>
                  {a.event && (
                    <span className="inline-block mt-2 text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                      Related to: {a.event.title}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Announcements;
