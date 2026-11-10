import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  // Server
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),

  CLIENT_URL: z.url(),

  // Database
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required."),
  MONGODB_DB: z.string().min(1, "MONGODB_DB is required."),

  // Better Auth
  BETTER_AUTH_URL: z.url(),

  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must be at least 32 characters."),

  // Google OAuth
  GOOGLE_CLIENT_ID: z.string().min(1, "GOOGLE_CLIENT_ID is required."),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, "GOOGLE_CLIENT_SECRET is required."),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string().min(1, "GITHUB_CLIENT_ID is required."),
  GITHUB_CLIENT_SECRET: z
    .string()
    .min(1, "GITHUB_CLIENT_SECRET is required."),
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.issues.map((issue) => {
    return `${issue.path.join(".")}: ${issue.message}`;
  });

  throw new Error(
    `Invalid environment configuration:\n${errors.join("\n")}`
  );
}

export const env = result.data;