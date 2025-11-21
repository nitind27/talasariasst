import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { saveMultipleToTemPages, deleteTemPagesFile } from "../../../../lib/upload";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM pages WHERE id = ?", [params.id]);
  if (rows.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const r = rows[0];
  const images = r.images_json ? JSON.parse(r.images_json) : [];
  return NextResponse.json({ ...r, images: Array.isArray(images) ? images : [] });
}

export async function PUT(req, { params }) {
  try {
    const form = await req.formData();

    const pool = getPool();
    const [existing] = await pool.query("SELECT images_json FROM pages WHERE id = ?", [params.id]);
    if (existing.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const oldImages = existing[0].images_json ? JSON.parse(existing[0].images_json) : [];
    const imageFiles = form.getAll("images");
    const imageOrderStr = form.get("imageOrder");
    const existingImages = form.getAll("existingImages");

    let imageUrls = [];
    
    // Process existing images first
    if (existingImages && existingImages.length > 0) {
      imageUrls = existingImages.filter(url => oldImages.includes(url));
    }

    // Add new images
    if (imageFiles && imageFiles.length > 0) {
      const validFiles = imageFiles.filter(f => f && f.size > 0);
      if (validFiles.length > 0) {
        const uploadedUrls = await saveMultipleToTemPages(validFiles);
        
        if (imageOrderStr) {
          try {
            const order = JSON.parse(imageOrderStr);
            if (Array.isArray(order)) {
              if (order.length > 0 && typeof order[0] === "object" && order[0].type) {
                const newImages = [];
                const existingOrdered = [];
                
                order.forEach((item) => {
                  if (item.type === "existing" && item.index >= 0 && item.index < existingImages.length) {
                    existingOrdered.push(existingImages[item.index]);
                  } else if (item.type === "new" && item.index >= 0 && item.index < uploadedUrls.length) {
                    newImages.push(uploadedUrls[item.index]);
                  }
                });
                
                // Merge maintaining order
                imageUrls = [...existingOrdered, ...newImages];
              } else {
                imageUrls = [...imageUrls, ...uploadedUrls];
              }
            } else {
              imageUrls = [...imageUrls, ...uploadedUrls];
            }
          } catch (e) {
            imageUrls = [...imageUrls, ...uploadedUrls];
          }
        } else {
          imageUrls = [...imageUrls, ...uploadedUrls];
        }
      }
    }

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "At least one image is required" }, { status: 400 });
    }

    // Delete removed images
    const imagesToDelete = oldImages.filter(url => !imageUrls.includes(url));
    for (const url of imagesToDelete) {
      await deleteTemPagesFile(url);
    }

    const images_json = JSON.stringify(imageUrls);

    await pool.query(
      "UPDATE pages SET images_json = ? WHERE id = ?",
      [images_json, params.id]
    );

    return NextResponse.json({ id: params.id, images: imageUrls });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req, { params }) {
  try {
    const pool = getPool();
    const [existing] = await pool.query("SELECT images_json FROM pages WHERE id = ?", [params.id]);
    
    if (existing.length > 0) {
      const images = existing[0].images_json ? JSON.parse(existing[0].images_json) : [];
      for (const url of images) {
        await deleteTemPagesFile(url);
      }
    }

    await pool.query("DELETE FROM pages WHERE id = ?", [params.id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const { status } = await req.json();
    const pool = getPool();
    await pool.query("UPDATE pages SET status = ? WHERE id = ?", [status ? 1 : 0, params.id]);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
