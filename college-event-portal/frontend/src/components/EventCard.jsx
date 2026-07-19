import React from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { HiCalendar, HiLocationMarker, HiUsers } from "react-icons/hi";

const categoryColors = {
  Technical: "bg-blue-100 text-blue-700",
  Cultural: "bg-pink-100 text-pink-700",
  Sports: "bg-green-100 text-green-700",
  Workshop: "bg-amber-100 text-amber-700",
  Seminar: "bg-purple-100 text-purple-700",
  Fest: "bg-red-100 text-red-700",
  Other: "bg-gray-100 text-gray-700",
};

const EventCard = ({ event }) => {
  const isOpen =
    event.seatsAvailable > 0 &&
    new Date() < new Date(event.registrationDeadline);

  return (
    <Link
      to={`/events/${event._id}`}
      className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="h-40 bg-gradient-to-br from-primary-500 to-primary-700 relative overflow-hidden">
        {event.bannerImage ? (
          <img
            src={event.bannerImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold opacity-30">
            {event.title.charAt(0)}
          </div>
        )}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${
            categoryColors[event.category] || categoryColors.Other
          }`}
        >
          {event.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 line-clamp-1">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2 flex-1">
          {event.description}
        </p>
        <div className="mt-3 space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <HiCalendar className="text-primary-600 shrink-0" />
            <span>
              {format(new Date(event.date), "dd MMM yyyy")} &middot; {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <HiLocationMarker className="text-primary-600 shrink-0" />
            <span className="line-clamp-1">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiUsers className="text-primary-600 shrink-0" />
            <span>{event.seatsAvailable} seats left</span>
          </div>
        </div>
        <div className="mt-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isOpen ? "Registration Open" : "Registration Closed"}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
