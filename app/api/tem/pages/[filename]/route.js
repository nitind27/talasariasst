import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mime from "mime";

export const dynamic = "force-dynamic";

export async function GET(_req, { params }) {
  try {
    const { filename } = params;

    if (!filename || Array.isArray(filename)) {
      return new NextResponse("Invalid filename", { status: 400 });
    }

    // Prevent directory traversal attempts
    const safeName = path.basename(filename);

    const temPagesDir = path.join(process.cwd(), "tem", "pages");
    const filePath = path.join(temPagesDir, safeName);

    // Ensure file is inside tem/pages folder
    if (!filePath.startsWith(temPagesDir)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Set proper MIME type
    const type = mime.getType(filePath) || "application/octet-stream";

    // Read file buffer
    const buffer = await fs.promises.readFile(filePath);

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": type,
        "Content-Length": fileSize.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("Tem Pages API error:", err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
