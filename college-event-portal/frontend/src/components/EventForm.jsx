import React from "react";

const categories = [
  "Technical",
  "Cultural",
  "Sports",
  "Workshop",
  "Seminar",
  "Fest",
  "Other",
];

const EventForm = ({ form, onChange, onSubmit, loading, submitLabel }) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Event Title
        </label>
        <input
          type="text"
          name="title"
          required
          value={form.title}
          onChange={onChange}
          className="input-field"
          placeholder="Annual Tech Fest 2026"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          required
          rows={4}
          value={form.description}
          onChange={onChange}
          className="input-field"
          placeholder="Describe the event..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Banner Image URL (optional)
        </label>
        <input
          type="url"
          name="bannerImage"
          value={form.bannerImage}
          onChange={onChange}
          className="input-field"
          placeholder="https://example.com/banner.jpg"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Seats
          </label>
          <input
            type="number"
            name="totalSeats"
            required
            min={1}
            value={form.totalSeats}
            onChange={onChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Date
          </label>
          <input
            type="date"
            name="date"
            required
            value={form.date}
            onChange={onChange}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Time
          </label>
          <input
            type="time"
            name="time"
            required
            value={form.time}
            onChange={onChange}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Venue
        </label>
        <input
          type="text"
          name="venue"
          required
          value={form.venue}
          onChange={onChange}
          className="input-field"
          placeholder="Main Auditorium"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Registration Deadline
        </label>
        <input
          type="datetime-local"
          name="registrationDeadline"
          required
          value={form.registrationDeadline}
          onChange={onChange}
          className="input-field"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isPublished"
          name="isPublished"
          checked={form.isPublished}
          onChange={onChange}
          className="h-4 w-4 rounded border-gray-300 text-primary-600"
        />
        <label htmlFor="isPublished" className="text-sm text-gray-700">
          Publish this event (visible to students)
        </label>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? "Saving..." : submitLabel}
      </button>
    </form>
  );
};

export default EventForm;
