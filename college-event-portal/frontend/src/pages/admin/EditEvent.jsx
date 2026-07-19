import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios.js";
import EventForm from "../../components/EventForm.jsx";

const toDateInput = (isoString) =>
  isoString ? new Date(isoString).toISOString().slice(0, 10) : "";

const toDateTimeLocalInput = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 16);
};

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          bannerImage: data.bannerImage || "",
          category: data.category,
          date: toDateInput(data.date),
          time: data.time,
          venue: data.venue,
          registrationDeadline: toDateTimeLocalInput(data.registrationDeadline),
          totalSeats: data.totalSeats,
          isPublished: data.isPublished,
        });
      } catch (error) {
        toast.error("Event not found");
        navigate("/admin/events");
      } finally {
        setFetching(false);
      }
    };
    fetchEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/events/${id}`, form);
      toast.success("Event updated successfully");
      navigate("/admin/events");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update event");
    } finally {
      setLoading(false);
    }
  };

  if (fetching || !form) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Event</h1>
      <div className="card p-6">
        <EventForm
          form={form}
          onChange={handleChange}
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditEvent;
