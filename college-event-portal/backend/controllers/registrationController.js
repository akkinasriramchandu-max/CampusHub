import Registration from "../models/Registration.js";
import Event from "../models/Event.js";

// @desc    Register current student for an event
// @route   POST /api/registrations/:eventId
// @access  Private/Student
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (new Date() > new Date(event.registrationDeadline)) {
      return res
        .status(400)
        .json({ message: "Registration deadline has passed" });
    }

    if (event.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Check for existing registration (active or cancelled)
    const existing = await Registration.findOne({
      event: event._id,
      student: req.user._id,
    });

    if (existing) {
      if (existing.status === "registered") {
        return res
          .status(400)
          .json({ message: "Already registered for this event" });
      }
      // Re-activate a previously cancelled registration
      existing.status = "registered";
      await existing.save();
      event.seatsAvailable -= 1;
      await event.save();
      return res.status(200).json(existing);
    }

    const registration = await Registration.create({
      event: event._id,
      student: req.user._id,
    });

    event.seatsAvailable -= 1;
    await event.save();

    return res.status(201).json(registration);
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a registration
// @route   DELETE /api/registrations/:eventId
// @access  Private/Student
export const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await Registration.findOne({
      event: req.params.eventId,
      student: req.user._id,
      status: "registered",
    });

    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registration.status = "cancelled";
    await registration.save();

    const event = await Event.findById(req.params.eventId);
    if (event) {
      event.seatsAvailable = Math.min(
        event.seatsAvailable + 1,
        event.totalSeats
      );
      await event.save();
    }

    return res.json({ message: "Registration cancelled" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged-in student's registrations
// @route   GET /api/registrations/my
// @access  Private/Student
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      student: req.user._id,
      status: "registered",
    }).populate("event");

    return res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations for a specific event (admin)
// @route   GET /api/registrations/event/:eventId
// @access  Private/Admin
export const getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({
      event: req.params.eventId,
      status: "registered",
    }).populate("student", "name email studentId department");

    return res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registrations across all events (admin)
// @route   GET /api/registrations
// @access  Private/Admin
export const getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ status: "registered" })
      .populate("student", "name email studentId department")
      .populate("event", "title date category");

    return res.json(registrations);
  } catch (error) {
    next(error);
  }
};
