import express from "express";
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getAdminEvents,
} from "../controllers/eventController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin/all", protect, admin, getAdminEvents);

router.route("/").get(getEvents).post(protect, admin, createEvent);

router
  .route("/:id")
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

export default router;
