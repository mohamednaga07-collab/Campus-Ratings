import Database from "better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

const stmt = db.prepare(`SELECT id, username, email FROM users`);
const users = stmt.all();
console.log("Users in database:");
users.forEach(u => {
  console.log(`  ${u.username}: ${u.email}`);
});
