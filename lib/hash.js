import bcrypt from "bcryptjs";

export async function hashPassword(plain) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain, hash) {
  return await bcrypt.compare(plain, hash);
}