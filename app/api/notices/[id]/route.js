import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { saveFileToUploads, deleteUploadByRelUrl } from "../../../../lib/upload";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM notices WHERE id = ? LIMIT 1", [params.id]);
  if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const r = rows[0];
  const images = r.images_json ? JSON.parse(r.images_json) : [];
  const first = Array.isArray(images) && images.length ? images[0] : null;
  return NextResponse.json({ ...r, images: Array.isArray(images) ? images : [], image_url: first || null });
}

export async function PUT(req, { params }) {
  try {
    const form = await req.formData();
    const title = form.get("title");
    const description = form.get("description");
    const expiry = form.get("expiry");

    const pdfFile = form.get("pdf");
    const imageFile = form.get("image");
    const videoFile = form.get("video");

    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM notices WHERE id = ? LIMIT 1", [params.id]);
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const old = rows[0];

    const oldImages = old.images_json ? JSON.parse(old.images_json) : [];
    const oldImage = Array.isArray(oldImages) && oldImages.length ? oldImages[0] : null;
    const oldVideo = old.video_url || null;

    const newPdfUrl = pdfFile ? await saveFileToUploads(pdfFile, "pdfs") : old.pdf_url;

    let image_url = oldImage;
    if (imageFile) {
      const saved = await saveFileToUploads(imageFile, "images");
      if (oldImage && oldImage !== saved) await deleteUploadByRelUrl(oldImage);
      image_url = saved;
    }
    const images_json = JSON.stringify(image_url ? [image_url] : []);

    let video_url = oldVideo;
    if (videoFile) {
      const savedVid = await saveFileToUploads(videoFile, "videos");
      if (oldVideo && oldVideo !== savedVid) await deleteUploadByRelUrl(oldVideo);
      video_url = savedVid;
    }

    await pool.query(
      "UPDATE notices SET title=?, description=?, images_json=?, video_url=?, pdf_url=?, expiry=? WHERE id=?",
      [title, description, images_json, video_url, newPdfUrl, expiry || null, params.id]
    );

    return NextResponse.json({ ok: true, video_url, image_url, pdf_url: newPdfUrl });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT images_json, video_url, pdf_url FROM notices WHERE id = ? LIMIT 1", [params.id]);
  const r = rows && rows[0];
  if (r) {
    const imgs = r.images_json ? JSON.parse(r.images_json) : [];
    for (const u of Array.isArray(imgs) ? imgs : []) {
      if (u) await deleteUploadByRelUrl(u);
    }
    if (r.video_url) await deleteUploadByRelUrl(r.video_url);
    if (r.pdf_url) await deleteUploadByRelUrl(r.pdf_url);
  }
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