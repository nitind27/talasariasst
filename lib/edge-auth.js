// lib/edge-auth.js
import { jwtVerify } from "jose";

export async function verifyJwtEdge(token) {
  if (!token) return null;
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // { id, name, username, ... }
  } catch {
    return null;
  }
}