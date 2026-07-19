import Event from "../models/Event.js";
import Registration from "../models/Registration.js";

// @desc    Get all published events (with optional search/filter)
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, upcoming } = req.query;
    const query = { isPublished: true };

    if (category && category !== "All") {
      query.category = category;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (upcoming === "true") {
      query.date = { $gte: new Date() };
    }

    const events = await Event.find(query).sort({ date: 1 });
    return res.json(events);
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    return res.json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      bannerImage,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      totalSeats,
    } = req.body;

    const event = await Event.create({
      title,
      description,
      bannerImage,
      category,
      date,
      time,
      venue,
      registrationDeadline,
      totalSeats,
      seatsAvailable: totalSeats,
      createdBy: req.user._id,
    });

    return res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const updatableFields = [
      "title",
      "description",
      "bannerImage",
      "category",
      "date",
      "time",
      "venue",
      "registrationDeadline",
      "isPublished",
    ];

    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    // Handle seat total changes while preserving already-booked seats
    if (req.body.totalSeats !== undefined) {
      const alreadyBooked = event.totalSeats - event.seatsAvailable;
      event.totalSeats = req.body.totalSeats;
      event.seatsAvailable = Math.max(req.body.totalSeats - alreadyBooked, 0);
    }

    const updated = await event.save();
    return res.json(updated);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await Registration.deleteMany({ event: event._id });
    await event.deleteOne();

    return res.json({ message: "Event removed" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events for admin (including unpublished)
// @route   GET /api/events/admin/all
// @access  Private/Admin
export const getAdminEvents = async (req, res, next) => {
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    return res.json(events);
  } catch (error) {
    next(error);
  }
};
