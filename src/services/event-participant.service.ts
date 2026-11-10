
import { ObjectId } from "mongodb";

import { database } from "../config/database.js";

import type { EventParticipantDocument } from "../types/event-participant.types.js";

const participantCollection =
  database.collection<EventParticipantDocument>("eventParticipants");

// Prevent duplicate joins
let indexPromise: Promise<string> | null = null;

function ensureParticipantIndex() {
  if (!indexPromise) {
    indexPromise = participantCollection
      .createIndex(
        { eventId: 1, userId: 1 },
        { unique: true }
      )
      .catch((error) => {
        indexPromise = null;
        throw error;
      });
  }

  return indexPromise;
}

// Join an Event
export async function joinEvent(
  eventId: string,
  userId: string,
  userEmail: string
) {
  if (!ObjectId.isValid(eventId)) {
    throw new Error("INVALID_EVENT_ID");
  }

  await ensureParticipantIndex();

  const participant: EventParticipantDocument = {
    eventId: new ObjectId(eventId),
    userId,
    userEmail,
    joinedAt: new Date(),
  };

  return participantCollection.insertOne(participant);
}

// Get Events Joined by a User
export async function getJoinedEvents(userId: string) {
  return participantCollection
    .aggregate([
      {
        $match: { userId },
      },
      {
        $lookup: {
          from: "events",
          localField: "eventId",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $sort: {
          "event.eventDate": 1,
        },
      },
    ])
    .toArray();
}

// Check Whether User Already Joined
export async function hasUserJoinedEvent(
  eventId: string,
  userId: string
) {
  if (!ObjectId.isValid(eventId)) {
    return false;
  }

  return participantCollection.findOne({
    eventId: new ObjectId(eventId),
    userId,
  });
}
