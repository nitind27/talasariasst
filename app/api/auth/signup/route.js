import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/hash";

export async function POST(req) {
  try {
    const { name, email, username, password } = await req.json();
    if (!name || !email || !username || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }
    const pool = getPool();
    const [exists] = await pool.query(
      "SELECT id FROM users WHERE email=? OR username=? LIMIT 1",
      [email, username]
    );
    if (exists.length) {
      return NextResponse.json({ error: "Email or username already exists" }, { status: 409 });
    }
    const password_hash = await hashPassword(password);
    const [res] = await pool.query(
      "INSERT INTO users (name, email, username, password_hash) VALUES (?, ?, ?, ?)",
      [name, email, username, password_hash]
    );
    return NextResponse.json({ id: res.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}