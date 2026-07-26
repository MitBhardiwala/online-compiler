import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// Temp directory sits at project root /temp
const TEMP_DIR = path.resolve("temp");

/**
 * Ensures the temp directory exists.
 * Called once on server startup.
 */
export function ensureTempDir(): void {
  if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
  }
}

/**
 * Writes code to a uniquely named temp file.
 * Returns the full file path.
 *
 * @param code
 * @param filename  e.g. "solution.py"
 * @returns absolute path to the created file
 */
export function writeTempFile(code: string, filename: string): string {
  const fileId = uuidv4();
  const filePath = path.join(TEMP_DIR, `${fileId}_${filename}`);
  fs.writeFileSync(filePath, code, "utf8");
  return filePath;
}

/**
 * Deletes a temp file silently.
 *
 * @param filePath
 */
export function deleteTempFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (err) {
    console.error("[deleteTempFile] failed:", (err as Error).message);
  }
}
