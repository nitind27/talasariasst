import { NextResponse } from "next/server";
import { saveFileToUploads, saveMultiple } from "../../../lib/upload";
import { getPool } from "../../../lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM notices ORDER BY id DESC");
  const mapped = rows.map(r => ({ ...r, images: r.images_json ? JSON.parse(r.images_json) : [] }));
  return NextResponse.json(mapped);
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const expiry = form.get("expiry") || null;

    const pdfFile = form.get("pdf");
    const imgFiles = form.getAll("images").filter(Boolean);
    const pdf_url = await saveFileToUploads(pdfFile, "pdfs");
    const images = await saveMultiple(imgFiles, "images");

    const pool = getPool();
    const [res] = await pool.query(
      "INSERT INTO notices (title, description, images_json, pdf_url, expiry) VALUES (?, ?, ?, ?, ?)",
      [title, description, JSON.stringify(images), pdf_url, expiry || null]
    );
    return NextResponse.json({ id: res.insertId }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}