import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { saveFileToUploads, saveMultiple } from "../../../../lib/upload";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM notices WHERE id = ? LIMIT 1", [params.id]);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const r = rows[0];
  return NextResponse.json({ ...r, images: r.images_json ? JSON.parse(r.images_json) : [] });
}

export async function PUT(req, { params }) {
  try {
    const form = await req.formData();
    const title = form.get("title");
    const description = form.get("description");
    const expiry = form.get("expiry");

    const pdfFile = form.get("pdf");
    const imgFiles = form.getAll("images").filter(Boolean);

    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM notices WHERE id = ? LIMIT 1", [params.id]);
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const old = rows[0];
    const oldImages = old.images_json ? JSON.parse(old.images_json) : [];

    const pdf_url = pdfFile ? await saveFileToUploads(pdfFile, "pdfs") : old.pdf_url;

    // MERGE: keep old images and append new uploads (if any)
    const newImages = await saveMultiple(imgFiles, "images");
    const images = [...oldImages, ...newImages];

    await pool.query(
      "UPDATE notices SET title=?, description=?, images_json=?, pdf_url=?, expiry=? WHERE id=?",
      [title, description, JSON.stringify(images), pdf_url, expiry || null, params.id]
    );
    return NextResponse.json({ ok: true, images });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const pool = getPool();
  await pool.query("DELETE FROM notices WHERE id = ?", [params.id]);
  return NextResponse.json({ ok: true });
}


export async function PATCH(req, { params }) {
    try {
      const body = await req.json();
      const pool = getPool();
  
      if (Object.prototype.hasOwnProperty.call(body, "status")) {
        await pool.query("UPDATE notices SET status=? WHERE id=?", [body.status ? 1 : 0, params.id]);
        return NextResponse.json({ ok: true });
      }
      if (Object.prototype.hasOwnProperty.call(body, "expiry")) {
        await pool.query("UPDATE notices SET expiry=? WHERE id=?", [body.expiry || null, params.id]);
        return NextResponse.json({ ok: true });
      }
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    } catch (e) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }
  