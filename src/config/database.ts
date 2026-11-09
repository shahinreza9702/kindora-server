
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
const databaseName = process.env.MONGODB_DB;

if (!mongoUri) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

if (!databaseName) {
  throw new Error("MONGODB_DB is not defined in environment variables.");
}

export const mongoClient = new MongoClient(mongoUri);

export const database = mongoClient.db(databaseName);

export async function connectDatabase() {
  await mongoClient.connect();

  // Verify that MongoDB is reachable.
  await database.command({ ping: 1 });

  console.log("MongoDB connected successfully.");
}
