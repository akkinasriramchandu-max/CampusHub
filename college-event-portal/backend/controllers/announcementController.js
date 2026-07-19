import Announcement from "../models/Announcement.js";

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find({})
      .populate("event", "title")
      .sort({ createdAt: -1 });
    return res.json(announcements);
  } catch (error) {
    next(error);
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private/Admin
export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, message, event } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    const announcement = await Announcement.create({
      title,
      message,
      event: event || null,
      createdBy: req.user._id,
    });

    return res.status(201).json(announcement);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
export const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }
    await announcement.deleteOne();
    return res.json({ message: "Announcement removed" });
  } catch (error) {
    next(error);
  }
};
