import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { saveFileToUploads, deleteUploadByRelUrl, saveMultipleToTem, deleteTemFile } from "../../../../lib/upload";

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
    const videoFile = form.get("video");

    // Handle multiple images
    const imageFiles = form.getAll("images"); // New image files
    const existingImages = form.getAll("existingImages"); // Existing image URLs
    const imageOrderStr = form.get("imageOrder"); // Order JSON string

    const pool = getPool();
    const [rows] = await pool.query("SELECT * FROM notices WHERE id = ? LIMIT 1", [params.id]);
    if (!rows.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const old = rows[0];

    const oldImages = old.images_json ? JSON.parse(old.images_json) : [];
    const oldVideo = old.video_url || null;

    const newPdfUrl = pdfFile ? await saveFileToUploads(pdfFile, "pdfs") : old.pdf_url;

    // Process images
    // Upload new images
    const uploadedUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const urls = await saveMultipleToTem(validFiles);
        uploadedUrls.push(...urls);
      }
    }

    // Merge existing and new images based on the order array
    // The order array contains objects like {type: "existing", index: 0} or {type: "new", index: 0}
    let imageUrls = [];
    if (imageOrderStr) {
      try {
        const order = JSON.parse(imageOrderStr);
        if (Array.isArray(order)) {
          order.forEach((item) => {
            if (item.type === "existing" && item.index >= 0 && item.index < existingImages.length) {
              imageUrls.push(existingImages[item.index]);
            } else if (item.type === "new" && item.index >= 0 && item.index < uploadedUrls.length) {
              imageUrls.push(uploadedUrls[item.index]);
            }
          });
        } else {
          // Fallback for old format (array of numbers)
          const existingCount = existingImages.length;
          if (Array.isArray(order) && typeof order[0] === "number") {
            order.forEach((pos) => {
              if (pos < existingCount) {
                imageUrls.push(existingImages[pos]);
              } else {
                const newIndex = pos - existingCount;
                if (newIndex < uploadedUrls.length) {
                  imageUrls.push(uploadedUrls[newIndex]);
                }
              }
            });
          } else {
            imageUrls = [...existingImages, ...uploadedUrls];
          }
        }
      } catch (e) {
        console.error("Error parsing image order:", e);
        // Fallback: just combine in order
        imageUrls = [...existingImages, ...uploadedUrls];
      }
    } else {
      // No order provided, just combine
      imageUrls = [...existingImages, ...uploadedUrls];
    }

    // Delete old images that are no longer in the list
    const currentUrls = new Set(imageUrls);
    for (const oldUrl of oldImages) {
      if (!currentUrls.has(oldUrl)) {
        if (oldUrl && oldUrl.startsWith("/api/tem/")) {
          await deleteTemFile(oldUrl);
        } else if (oldUrl) {
          await deleteUploadByRelUrl(oldUrl);
        }
      }
    }

    const images_json = JSON.stringify(imageUrls);

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

    return NextResponse.json({ ok: true, video_url, images: imageUrls, pdf_url: newPdfUrl });
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
      if (u && u.startsWith("/api/tem/")) {
        await deleteTemFile(u);
      } else if (u) {
        await deleteUploadByRelUrl(u);
      }
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