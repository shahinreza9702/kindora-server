
import type { Request, Response, NextFunction } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

const authUrl = process.env.BETTER_AUTH_URL;

if (!authUrl) {
  throw new Error("BETTER_AUTH_URL is not configured.");
}

const JWKS = createRemoteJWKSet(
  new URL("/api/auth/jwks", authUrl)
);

export interface AuthenticatedUser {
  id: string;
  email?: string;
  name?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export async function verifyJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const token = authorization.slice(7);

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authUrl,
      audience: authUrl,
    });

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });
    }

    req.user = {
      id: payload.sub,
      email:
        typeof payload.email === "string"
          ? payload.email
          : undefined,
      name:
        typeof payload.name === "string"
          ? payload.name
          : undefined,
    };

    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}
