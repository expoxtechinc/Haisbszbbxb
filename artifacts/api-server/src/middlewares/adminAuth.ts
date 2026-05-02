import type { Request, Response, NextFunction } from "express";
import { createHmac } from "crypto";

function getSecret(): string {
  const secret = process.env["ADMIN_SECRET"] ?? process.env["ADMIN_PASSWORD"];
  if (!secret) {
    throw new Error("ADMIN_PASSWORD environment variable must be set");
  }
  return secret;
}

export function signToken(expiresAt: number): string {
  const secret = getSecret();
  const payload = String(expiresAt);
  const hmac = createHmac("sha256", secret).update(payload).digest("hex");
  return `${payload}.${hmac}`;
}

export function verifyToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, givenHmac] = parts;
  const expiresAt = Number(payload);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
  const secret = getSecret();
  const expectedHmac = createHmac("sha256", secret).update(payload).digest("hex");
  return expectedHmac === givenHmac;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers["authorization"] ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!verifyToken(token)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export function checkPassword(password: string): boolean {
  const adminPassword = process.env["ADMIN_PASSWORD"];
  if (!adminPassword) return false;
  return password === adminPassword;
}
