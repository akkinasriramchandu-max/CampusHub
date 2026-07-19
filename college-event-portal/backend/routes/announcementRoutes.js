import express from "express";
import {
  getAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.route("/").get(getAnnouncements).post(protect, admin, createAnnouncement);
router.delete("/:id", protect, admin, deleteAnnouncement);

export default router;
