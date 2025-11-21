import { NextResponse } from "next/server";
import { getPool } from "../../../../lib/db";
import { copyPublicImageToTemPages } from "../../../../lib/upload";

export const dynamic = "force-dynamic";

// Hardcoded images from Home.jsx
const defaultImages = [
  "/Slider/imgslider.jpeg",
  "/card/1.jpeg",
  "/card/2.jpeg",
  "/card/3.jpeg",
  "/card/4.jpeg",
  "/card/5.jpeg",
  "/card/6.jpeg",
  "/card/7.jpeg",
  "/card/8.jpeg",
  "/card/9.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.34 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.35 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.35 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.36 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.36 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.37 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.38 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.38 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM (2).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.39 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.40 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.40 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.41 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.41 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.42 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.42 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.43 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.43 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.44 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.44 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.45 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.45 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.46 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.46 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.47 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.47 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.48 PM (1).jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.48 PM.jpeg",
  "/card/WhatsApp Image 2025-09-26 at 4.27.49 PM.jpeg",
];

export async function POST() {
  try {
    const pool = getPool();
    const imageUrls = [];
    
    // Copy each image from public to tem/pages
    for (const publicPath of defaultImages) {
      const newUrl = await copyPublicImageToTemPages(publicPath);
      if (newUrl) {
        imageUrls.push(newUrl);
        console.log(`Copied: ${publicPath} -> ${newUrl}`);
      } else {
        console.warn(`Failed to copy: ${publicPath}`);
      }
    }
    
    if (imageUrls.length === 0) {
      return NextResponse.json({ error: "No images were copied successfully" }, { status: 400 });
    }
    
    // Save to database
    const images_json = JSON.stringify(imageUrls);
    const [res] = await pool.query(
      "INSERT INTO pages (images_json, status) VALUES (?, ?)",
      [images_json, 1]
    );
    
    return NextResponse.json({ 
      success: true, 
      id: res.insertId, 
      imagesCount: imageUrls.length,
      images: imageUrls 
    }, { status: 201 });
  } catch (e) {
    console.error("Migration error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

