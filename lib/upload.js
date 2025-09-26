import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

export async function saveFileToUploads(file, subfolder = "") {
  if (!file) return null;
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(file.name || "");
  const name = `${Date.now()}-${randomUUID()}${ext || ""}`;
  const dir = path.join(process.cwd(), "public", "uploads", subfolder);
  const relUrl = `/uploads/${subfolder ? subfolder + "/" : ""}${name}`;

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(path.join(dir, name), buffer);
  return relUrl;
}

export async function saveMultiple(files, subfolder) {
  const out = [];
  for (const f of files || []) {
    const saved = await saveFileToUploads(f, subfolder);
    if (saved) out.push(saved);
  }
  return out;
}