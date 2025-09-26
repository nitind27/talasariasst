import { NextResponse } from "next/server";
import { getTokenFromCookies, verifyJwt } from "../../../../lib/auth";

export async function GET(req) {
  const token = getTokenFromCookies(req.cookies);
  const payload = token && verifyJwt(token);
  if (!payload) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: { id: payload.id, name: payload.name, username: payload.username } });
}