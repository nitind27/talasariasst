import { NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import { saveMultipleToTemPages } from "../../../lib/upload";

export const dynamic = "force-dynamic";

export async function GET() {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM pages ORDER BY id DESC");
  const mapped = rows.map(r => {
    const images = r.images_json ? JSON.parse(r.images_json) : [];
    return { ...r, images: Array.isArray(images) ? images : [] };
  });
  return NextResponse.json(mapped);
}

export async function POST(req) {
  try {
    const form = await req.formData();

    // Handle multiple images
    const imageFiles = form.getAll("images");
    const imageOrderStr = form.get("imageOrder");
    
    let imageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const uploadedUrls = await saveMultipleToTemPages(validFiles);
        
        if (imageOrderStr) {
          try {
            const order = JSON.parse(imageOrderStr);
            if (Array.isArray(order)) {
              if (order.length > 0 && typeof order[0] === "object" && order[0].type) {
                order.forEach((item) => {
                  if (item.type === "new" && item.index >= 0 && item.index < uploadedUrls.length) {
                    imageUrls.push(uploadedUrls[item.index]);
                  }
                });
              } else {
                imageUrls = uploadedUrls;
              }
            } else {
              imageUrls = uploadedUrls;
            }
          } catch (e) {
            console.error("Error parsing image order:", e);
            imageUrls = uploadedUrls;
          }
        } else {
          imageUrls = uploadedUrls;
        }
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    const images_json = JSON.stringify(imageUrls);

    const pool = getPool();
    const [res] = await pool.query(
      "INSERT INTO pages (images_json, status) VALUES (?, ?)",
      [images_json, 1]
    );

    return NextResponse.json({ id: res.insertId, images: imageUrls }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
