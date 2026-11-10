
import type { Request, Response } from "express";
import { MongoServerError } from "mongodb";

import { getEventById } from "../services/event.service.js";

import {
  joinEvent,
  getJoinedEvents,
  hasUserJoinedEvent,
} from "../services/event-participant.service.js";

// Join Event
export async function handleJoinEvent(
  req: Request,
  res: Response
) {
  try {
    const { id } = req.params;

    if (!req.user?.id || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const event = await getEventById(id as string);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (event.eventDate.getTime() <= Date.now()) {
      return res.status(400).json({
        success: false,
        message: "You cannot join a past event.",
      });
    }

    const alreadyJoined = await hasUserJoinedEvent(
      id as string,
      req.user.id
    );

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this event.",
      });
    }

    await joinEvent(
      id as string,
      req.user.id,
      req.user.email
    );

    return res.status(201).json({
      success: true,
      message: "You have successfully joined the event.",
    });
  } catch (error) {
    if (
      error instanceof MongoServerError &&
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message: "You have already joined this event.",
      });
    }

    console.error("Join event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to join event.",
    });
  }
}

// Get My Joined Events
export async function handleGetJoinedEvents(
  req: Request,
  res: Response
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const events = await getJoinedEvents(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Joined events fetched successfully.",
      data: events,
    });
  } catch (error) {
    console.error("Get joined events error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch joined events.",
    });
  }
}
