
import { Router } from "express";

import { verifyJWT } from "../middleware/verify-jwt.js";

import {
  handleCreateEvent,
  handleGetUpcomingEvents,
  handleGetEventById,
  handleUpdateEvent,
  handleDeleteEvent,
  handleGetMyEvents,
} from "../controllers/event.controller.js";

const router = Router();

// Public Routes
router.get("/", handleGetUpcomingEvents);

// Protected Routes
// Specific routes must come before dynamic :id routes.
router.get("/my-events", verifyJWT, handleGetMyEvents);

router.post("/", verifyJWT, handleCreateEvent);

// Dynamic Routes
router.get("/:id", handleGetEventById);
router.patch("/:id", verifyJWT, handleUpdateEvent);
router.delete("/:id", verifyJWT, handleDeleteEvent);

export default router;
