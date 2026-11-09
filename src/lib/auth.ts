
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";

import { database, mongoClient } from "../config/database.js";

export const auth = betterAuth({
  appName: "Kindora",

  baseURL: process.env.BETTER_AUTH_URL!,

  secret: process.env.BETTER_AUTH_SECRET!,

  trustedOrigins: [
    process.env.CLIENT_URL!,
  ],

  database: mongodbAdapter(database, {
    client: mongoClient,
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  plugins: [
    jwt(),
  ],
});
