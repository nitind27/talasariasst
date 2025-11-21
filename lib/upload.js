import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";

// Save to tem folder (outside public) for images
export async function saveFileToTem(file) {
  if (!file) return null;
  const filename = file.name || "";
  const size = typeof file.size === "number" ? file.size : 0;
  if (!filename || size <= 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(filename);
  const name = `${Date.now()}-${randomUUID()}${ext || ""}`;
  const dir = path.join(process.cwd(), "tem");
  const relUrl = `/api/tem/${name}`;

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(path.join(dir, name), buffer);
  return relUrl;
}

// Save multiple images to tem folder
export async function saveMultipleToTem(files) {
  const out = [];
  for (const f of files || []) {
    const saved = await saveFileToTem(f);
    if (saved) out.push(saved);
  }
  return out;
}

// Delete file from tem folder
export async function deleteTemFile(relUrl) {
  try {
    if (!relUrl) return;
    // Extract filename from /api/tem/filename
    const filename = relUrl.replace("/api/tem/", "");
    if (!filename || filename.includes("..") || filename.includes("/")) return;
    const filePath = path.join(process.cwd(), "tem", filename);
    const temDir = path.join(process.cwd(), "tem");
    if (!filePath.startsWith(temDir)) return;
    await fs.promises.unlink(filePath).catch(() => {});
  } catch {
    // ignore
  }
}

// Original function for other file types (PDF, video) - keep in public/uploads
export async function saveFileToUploads(file, subfolder = "") {
  if (!file) return null;
  // Guard against empty file inputs
  const filename = file.name || "";
  const size = typeof file.size === "number" ? file.size : 0;
  if (!filename || size <= 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(filename);
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

export async function deleteUploadByRelUrl(relUrl) {
  try {
    if (!relUrl) return;
    // Only allow deleting inside public/uploads
    const base = path.join(process.cwd(), "public");
    const abs = path.join(process.cwd(), relUrl.replace(/^\//, ""));
    if (!abs.startsWith(base)) return;
    await fs.promises.unlink(abs).catch(() => {});
  } catch {
    // ignore
  }
}

// Save to tem/pages folder for slider pages
export async function saveFileToTemPages(file) {
  if (!file) return null;
  const filename = file.name || "";
  const size = typeof file.size === "number" ? file.size : 0;
  if (!filename || size <= 0) return null;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const ext = path.extname(filename);
  const name = `${Date.now()}-${randomUUID()}${ext || ""}`;
  const dir = path.join(process.cwd(), "tem", "pages");
  const relUrl = `/api/tem/pages/${name}`;

  await fs.promises.mkdir(dir, { recursive: true });
  await fs.promises.writeFile(path.join(dir, name), buffer);
  return relUrl;
}

// Save multiple images to tem/pages folder
export async function saveMultipleToTemPages(files) {
  const out = [];
  for (const f of files || []) {
    const saved = await saveFileToTemPages(f);
    if (saved) out.push(saved);
  }
  return out;
}

// Delete file from tem/pages folder
export async function deleteTemPagesFile(relUrl) {
  try {
    if (!relUrl) return;
    const filename = relUrl.replace("/api/tem/pages/", "");
    if (!filename || filename.includes("..") || filename.includes("/")) return;
    const filePath = path.join(process.cwd(), "tem", "pages", filename);
    const temPagesDir = path.join(process.cwd(), "tem", "pages");
    if (!filePath.startsWith(temPagesDir)) return;
    await fs.promises.unlink(filePath).catch(() => {});
  } catch {
    // ignore
  }
}