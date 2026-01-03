import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { randomUUID } from "crypto";

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

// Update student1 email to your Gmail
const updateStmt = db.prepare(`
  UPDATE users SET email = ? WHERE username = ?
`);

updateStmt.run("mohamednaga07@gmail.com", "student1");
console.log("✅ Updated student1 email to mohamednaga07@gmail.com");
console.log("   Username: student1");
console.log("   Password: Password123");
console.log("   Email: mohamednaga07@gmail.com");
