
import type { Request, Response } from "express";

import {
  createEvent,
  getUpcomingEvents,
  getEventById,
  updateEventById,
  deleteEventById,
} from "../services/event.service.js";

import {
  eventSchema,
  updateEventSchema,
} from "../validations/event.validation.js";

// Create Event
export async function handleCreateEvent(
  req: Request,
  res: Response
) {
  try {
    const parsed = eventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid event data.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (!req.user?.id || !req.user.email) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const event = await createEvent(
      parsed.data,
      req.user.id,
      req.user.email
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Create event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create event.",
    });
  }
}

// Get All Upcoming Events
export async function handleGetUpcomingEvents(
  _req: Request,
  res: Response
) {
  try {
    const events = await getUpcomingEvents();

    return res.status(200).json({
      success: true,
      message: "Upcoming events fetched successfully.",
      data: events,
    });
  } catch (error) {
    console.error("Get events error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch events.",
    });
  }
}

// Get Single Event
export async function handleGetEventById(
  req: Request,
  res: Response
) {
  try {
    const event = await getEventById(req.params.id as string);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event fetched successfully.",
      data: event,
    });
  } catch (error) {
    console.error("Get event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch event.",
    });
  }
}

// Update Event
export async function handleUpdateEvent(
  req: Request,
  res: Response
) {
  try {
    const parsed = updateEventSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid event data.",
        errors: parsed.error.flatten().fieldErrors,
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const existingEvent = await getEventById(
      req.params.id as string
    );

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (existingEvent.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this event.",
      });
    }

    const updatedEvent = await updateEventById(
      req.params.id as string,
      parsed.data
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Update event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event.",
    });
  }
}

// Delete Event
export async function handleDeleteEvent(
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

    const existingEvent = await getEventById(
      req.params.id as string
    );

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found.",
      });
    }

    if (existingEvent.createdBy !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this event.",
      });
    }

    await deleteEventById(req.params.id as string);

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully.",
    });
  } catch (error) {
    console.error("Delete event error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event.",
    });
  }
}
