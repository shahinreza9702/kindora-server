
import express, { type ErrorRequestHandler } from "express";
import cors from "cors";
import helmet, { type HelmetOptions } from "helmet";
import { toNodeHandler } from "better-auth/node";

import { env } from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { auth } from "./lib/auth.js";
import { verifyJWT } from "./middleware/verify-jwt.js";
import eventRoutes from "./routes/event.routes.js";
import eventParticipantRoutes from "./routes/event-participant.routes.js";

const app = express();

const helmetMiddleware = helmet as unknown as (
  options?: HelmetOptions
) => import("express").RequestHandler;

// Security Headers
app.use(
  helmetMiddleware({
    crossOriginOpenerPolicy: {
      policy: "same-origin-allow-popups",
    },
  })
);

// CORS Configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure MongoDB is connected before handling API requests
app.use(async (_req, _res, next) => {
  try {
    await connectDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

// Better Auth handler must come before express.json()
app.all("/api/auth/{*any}", toNodeHandler(auth));

// JSON Body Parser
app.use(express.json({ limit: "1mb" }));

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

// Not Found Handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

// Centralized Error Handler
const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next
) => {
  console.error("API Error:", error);

  if (error instanceof SyntaxError && "body" in error) {
    res.status(400).json({
      success: false,
      message: "Invalid JSON request body.",
    });
    return;
  }

  const errorType =
    typeof error === "object" &&
    error !== null &&
    "type" in error
      ? error.type
      : undefined;

  if (errorType === "entity.too.large") {
    res.status(413).json({
      success: false,
      message: "Request body is too large.",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
};

app.use(errorHandler);

// Start Server
async function startServer() {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      console.log(`Kindora server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Start local server only outside Vercel
if (process.env.VERCEL !== "1") {
  startServer();
}

// Export Express app for Vercel
export default app;
