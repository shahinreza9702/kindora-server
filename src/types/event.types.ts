
import type { ObjectId } from "mongodb";

import type { CreateEventInput } from "../validations/event.validation.js";

export interface EventDocument extends CreateEventInput {
  _id?: ObjectId;
  createdBy: string;
  organizerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}
