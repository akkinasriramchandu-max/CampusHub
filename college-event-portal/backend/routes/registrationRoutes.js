import express from "express";
import {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  getAllRegistrations,
} from "../controllers/registrationController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.get("/my", protect, getMyRegistrations);
router.get("/", protect, admin, getAllRegistrations);
router.get("/event/:eventId", protect, admin, getEventRegistrations);
router.post("/:eventId", protect, registerForEvent);
router.delete("/:eventId", protect, cancelRegistration);

export default router;
