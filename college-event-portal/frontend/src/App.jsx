import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Events from "./pages/Events.jsx";
import EventDetail from "./pages/EventDetail.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import MyRegistrations from "./pages/MyRegistrations.jsx";
import Announcements from "./pages/Announcements.jsx";

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageEvents from "./pages/admin/ManageEvents.jsx";
import CreateEvent from "./pages/admin/CreateEvent.jsx";
import EditEvent from "./pages/admin/EditEvent.jsx";
import AdminRegistrations from "./pages/admin/AdminRegistrations.jsx";
import ManageAnnouncements from "./pages/admin/ManageAnnouncements.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <AdminRoute>
                <ManageEvents />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/create"
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/events/:id/edit"
            element={
              <AdminRoute>
                <EditEvent />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/registrations"
            element={
              <AdminRoute>
                <AdminRegistrations />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/announcements"
            element={
              <AdminRoute>
                <ManageAnnouncements />
              </AdminRoute>
            }
          />

          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-3xl font-bold text-gray-800">
                  404 - Page Not Found
                </h1>
              </div>
            }
          />
        </Routes>
      </main>
      <footer className="border-t border-gray-200 py-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} College Event Management Portal
      </footer>
    </div>
  );
}

export default App;
