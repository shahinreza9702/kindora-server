
import type { ObjectId } from "mongodb";

export interface EventParticipantDocument {
  _id?: ObjectId;
  eventId: ObjectId;
  userId: string;
  userEmail: string;
  joinedAt: Date;
}
