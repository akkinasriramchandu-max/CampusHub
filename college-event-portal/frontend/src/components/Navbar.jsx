import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { HiMenu, HiX } from "react-icons/hi";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-50 text-primary-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              College Event Portal
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/events" className={linkClass}>
              Events
            </NavLink>
            <NavLink to="/announcements" className={linkClass}>
              Announcements
            </NavLink>
            {user && user.role === "student" && (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
                <NavLink to="/my-registrations" className={linkClass}>
                  My Registrations
                </NavLink>
              </>
            )}
            {user && user.role === "admin" && (
              <NavLink to="/admin" className={linkClass}>
                Admin Panel
              </NavLink>
            )}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Hi, <span className="font-medium">{user.name}</span>
                </span>
                <button onClick={handleLogout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setOpen(!open)}
          >
            {open ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-gray-200 px-4 py-3 space-y-1">
          <NavLink to="/events" className={linkClass} onClick={() => setOpen(false)}>
            Events
          </NavLink>
          <NavLink
            to="/announcements"
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            Announcements
          </NavLink>
          {user && user.role === "student" && (
            <>
              <NavLink
                to="/dashboard"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/my-registrations"
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                My Registrations
              </NavLink>
            </>
          )}
          {user && user.role === "admin" && (
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>
              Admin Panel
            </NavLink>
          )}
          <div className="pt-2 flex gap-2">
            {user ? (
              <button onClick={handleLogout} className="btn-secondary w-full">
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full text-center">
                  Login
                </Link>
                <Link to="/register" className="btn-primary w-full text-center">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
