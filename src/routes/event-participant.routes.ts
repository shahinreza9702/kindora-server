
import { Router } from "express";

import { verifyJWT } from "../middleware/verify-jwt.js";

import {
  handleJoinEvent,
  handleGetJoinedEvents,
} from "../controllers/event-participant.controller.js";

const router = Router();

// Get My Joined Events
router.get("/my-events", verifyJWT, handleGetJoinedEvents);

// Join an Event
router.post("/:id/join", verifyJWT, handleJoinEvent);

export default router;
