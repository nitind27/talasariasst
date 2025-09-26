import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { verifyPassword } from "../../../../lib/hash";
import { signJwt, setSessionCookie } from "../../../../lib/auth";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ error: "Username/email and password required" }, { status: 400 });
    }
    const pool = getPool();
    // Allow login by username OR email
    const [rows] = await pool.query(
      "SELECT id, name, username, password_hash FROM users WHERE username=? OR email=? LIMIT 1",
      [username, username]
    );
    if (!rows.length) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const user = rows[0];
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signJwt({ id: user.id, name: user.name, username: user.username, role: "admin" });
    const res = NextResponse.json({ ok: true });
    setSessionCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}