
import { ObjectId } from "mongodb";

import { database, mongoClient } from "../config/database.js";

import type { EventDocument } from "../types/event.types.js";
import type {
  CreateEventInput,
  UpdateEventInput,
} from "../validations/event.validation.js";

const eventCollection = database.collection<EventDocument>("events");
const participantCollection =
  database.collection("eventParticipants");

// Create Event
export async function createEvent(
  data: CreateEventInput,
  userId: string,
  userEmail: string
) {
  const now = new Date();

  const event: EventDocument = {
    ...data,
    createdBy: userId,
    organizerEmail: userEmail,
    createdAt: now,
    updatedAt: now,
  };

  const result = await eventCollection.insertOne(event);

  return {
    ...event,
    _id: result.insertedId,
  };
}

// Get All Upcoming Events
export async function getUpcomingEvents() {
  return eventCollection
    .find({
      eventDate: { $gt: new Date() },
    })
    .sort({ eventDate: 1 })
    .toArray();
}

// Get Single Event
export async function getEventById(id: string) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  return eventCollection.findOne({
    _id: new ObjectId(id),
  });
}

// Update Event
export async function updateEventById(
  id: string,
  data: UpdateEventInput
) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const result = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...data,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  return result;
}

// Delete Event
export async function deleteEventById(
  id: string,
  userId: string
) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const eventId = new ObjectId(id);
  const session = mongoClient.startSession();

  try {
    let deletedEvent: EventDocument | null = null;

    await session.withTransaction(async () => {
      deletedEvent = await eventCollection.findOneAndDelete(
        {
          _id: eventId,
          createdBy: userId,
        },
        { session }
      );

      if (!deletedEvent) {
        return;
      }

      await participantCollection.deleteMany(
        { eventId },
        { session }
      );
    });

    return deletedEvent;
  } finally {
    await session.endSession();
  }
}

// Get Events Created by a Specific User
export async function getEventsByCreator(userId: string) {
  return eventCollection
    .find({
      createdBy: userId,
    })
    .sort({
      createdAt: -1,
    })
    .toArray();
}
