
import "dotenv/config";

import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";

import { connectDatabase } from "./config/database.js";
import { auth } from "./lib/auth.js";
import { verifyJWT } from "./middleware/verify-jwt.js";
import eventRoutes from "./routes/event.routes.js";
import eventParticipantRoutes from "./routes/event-participant.routes.js";

const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Better Auth handler must come before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

// Body parser for other API routes
app.use(express.json());

// Health Check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Kindora API is running.",
  });
});

// Event API Routes
app.use("/api/events", eventRoutes);

// Event Participant API Routes
app.use("/api/event-participants", eventParticipantRoutes);

// Protected JWT Test Route
app.get("/api/protected/test", verifyJWT, (req, res) => {
  res.status(200).json({
    success: true,
    message: "JWT authentication successful.",
    user: req.user,
  });
});

// Start Server
async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Kindora server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
