import fs from "fs";
import path from "path";
import mime from "mime"; // npm i mime

export default async function handler(req, res) {
  try {
    const { filename } = req.query;

    if (!filename || Array.isArray(filename)) {
      return res.status(400).send("Invalid filename");
    }

    // Prevent directory traversal attempts
    const safeName = path.basename(filename);

    const uploadsDir = path.join(process.cwd(), "uploads");
    const filePath = path.join(uploadsDir, safeName);

    // ensure file is inside uploads folder
    if (!filePath.startsWith(uploadsDir)) {
      return res.status(403).send("Forbidden");
    }

    // file exist check
    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;

    // Set proper MIME type
    const type = mime.getType(filePath) || "application/octet-stream";
    res.setHeader("Content-Type", type);

    // Cache for faster repeat loads (adjust as needed)
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");

    // Optionally set content-length
    res.setHeader("Content-Length", fileSize);

    // Stream the file (efficient for large files)
    const stream = fs.createReadStream(filePath);
    stream.on("error", (err) => {
      console.error("Stream error:", err);
      if (!res.headersSent) res.status(500).end("Server error");
    });
    stream.pipe(res);
  } catch (err) {
    console.error("Upload API error:", err);
    res.status(500).send("Internal Server Error");
  }
}
