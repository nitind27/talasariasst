import jwt from "jsonwebtoken";

const COOKIE = "session";

export function signJwt(payload) {
  const secret = process.env.AUTH_SECRET;
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}
export function verifyJwt(token) {
  const secret = process.env.AUTH_SECRET;
  try { return jwt.verify(token, secret); } catch { return null; }
}

export function setSessionCookie(res, token) {
  res.cookies.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
export function clearSessionCookie(res) {
  res.cookies.set(COOKIE, "", { path: "/", maxAge: 0 });
}
export function getTokenFromCookies(cookies) {
  return cookies.get(COOKIE)?.value || null;
}