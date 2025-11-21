import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { saveFileToUploads, saveMultipleToTem } from "../../../lib/upload";

export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM notices ORDER BY id DESC");
  const mapped = rows.map(r => {
    const images = r.images_json ? JSON.parse(r.images_json) : [];
    const first = Array.isArray(images) && images.length ? images[0] : null;
    return { ...r, images: Array.isArray(images) ? images : [], image_url: first || null };
  });
  return NextResponse.json(mapped);
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const title = form.get("title") || "";
    const description = form.get("description") || "";
    const expiry = form.get("expiry") || null;

    const pdfFile = form.get("pdf");
    const videoFile = form.get("video");

    // Handle multiple images
    const imageFiles = form.getAll("images"); // Get all image files
    const imageOrderStr = form.get("imageOrder"); // Get the order JSON string
    
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      // Filter out empty files
      const validFiles = imageFiles.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        // Save all images to tem folder (they're saved in upload order)
        const uploadedUrls = await saveMultipleToTem(validFiles);
        
        // Apply ordering if provided
        if (imageOrderStr) {
          try {
            const order = JSON.parse(imageOrderStr);
            if (Array.isArray(order)) {
              // New format: array of {type, index} objects
              if (order.length > 0 && typeof order[0] === "object" && order[0].type) {
                order.forEach((item) => {
                  if (item.type === "new" && item.index >= 0 && item.index < uploadedUrls.length) {
                    imageUrls.push(uploadedUrls[item.index]);
                  }
                });
              } else if (typeof order[0] === "number") {
                // Old format: array of indices
                const reordered = order.map(idx => uploadedUrls[idx]).filter(Boolean);
                imageUrls = reordered.length === uploadedUrls.length ? reordered : uploadedUrls;
              } else {
                imageUrls = uploadedUrls;
              }
            } else {
              imageUrls = uploadedUrls;
            }
          } catch (e) {
            // If parsing fails, use original order
            console.error("Error parsing image order:", e);
            imageUrls = uploadedUrls;
          }
        } else {
          imageUrls = uploadedUrls;
        }
      }
    }

    const pdf_url = await saveFileToUploads(pdfFile, "pdfs");
    const video_url = await saveFileToUploads(videoFile, "videos");

    const images_json = JSON.stringify(imageUrls);

    const pool = getPool();
    const [res] = await pool.query(
      "INSERT INTO notices (title, description, images_json, video_url, pdf_url, expiry) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, images_json, video_url, pdf_url, expiry || null]
    );

    return NextResponse.json({ id: res.insertId, video_url, images: imageUrls, pdf_url }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}