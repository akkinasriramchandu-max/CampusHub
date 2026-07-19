import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import EventForm from "../../components/EventForm.jsx";

const initialForm = {
  title: "",
  description: "",
  bannerImage: "",
  category: "Technical",
  date: "",
  time: "",
  venue: "",
  registrationDeadline: "",
  totalSeats: 50,
  isPublished: true,
};

const CreateEvent = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/events", form);
      toast.success("Event created successfully");
      navigate("/admin/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h1>
      <div className="card p-6">
        <EventForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Event"
        />
      </div>
    </div>
  );
};

export default CreateEvent;
