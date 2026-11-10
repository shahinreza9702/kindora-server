
import { MongoClient } from "mongodb";

import { env } from "./env.js";

export const mongoClient = new MongoClient(env.MONGODB_URI);

export const database = mongoClient.db(env.MONGODB_DB);

let connectionPromise: Promise<void> | null = null;

export async function connectDatabase() {
  if (!connectionPromise) {
    connectionPromise = (async () => {
      await mongoClient.connect();
      await database.command({ ping: 1 });

      console.log("MongoDB connected successfully.");
    })().catch((error) => {
      connectionPromise = null;
      throw error;
    });
  }

  return connectionPromise;
}
