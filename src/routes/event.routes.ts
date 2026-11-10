
import { Router } from "express";

import { verifyJWT } from "../middleware/verify-jwt.js";

import {
  handleCreateEvent,
  handleGetUpcomingEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
} from "../controllers/event.controller.js";

const router = Router();

// Public Routes
router.get("/", handleGetUpcomingEvents);
router.get("/:id", handleGetEventById);

// Protected Routes
router.post("/", verifyJWT, handleCreateEvent);
router.patch("/:id", verifyJWT, handleUpdateEvent);
router.delete("/:id", verifyJWT, handleDeleteEvent);

export default router;
