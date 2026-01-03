import Database from "better-sqlite3";
import path from "path";
import crypto from "crypto";
import { randomUUID } from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

type DemoUser = {
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "student" | "teacher" | "admin";
};

const demoUsers: DemoUser[] = [
  {
    username: "student1",
    password: "Password123",
    email: "student1@example.com",
    firstName: "Student",
    lastName: "One",
    role: "student",
  },
  {
    username: "teacher1",
    password: "Password123",
    email: "teacher1@example.com",
    firstName: "Sarah",
    lastName: "Johnson",
    role: "teacher",
  },
  {
    username: "admin1",
    password: "Password123",
    email: "admin1@example.com",
    firstName: "Admin",
    lastName: "One",
    role: "admin",
  },
];

const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

const insertStmt = db.prepare(`
  INSERT INTO users (id, username, password, email, firstName, lastName, role, createdAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
`);

const updateStmt = db.prepare(`
  UPDATE users
  SET password = ?, email = ?, firstName = ?, lastName = ?, role = ?
  WHERE username = ?
`);

const existsStmt = db.prepare("SELECT 1 FROM users WHERE username = ?");

console.log("╔══════════════════════════════════════╗");
console.log("║     ✅ DEMO USERS (DEV)              ║");
console.log("╚══════════════════════════════════════╝");

let created = 0;
let updated = 0;

for (const u of demoUsers) {
  const exists = existsStmt.get(u.username);
  if (exists) {
    updateStmt.run(
      hashPassword(u.password),
      u.email,
      u.firstName,
      u.lastName,
      u.role,
      u.username,
    );
    updated++;
    continue;
  }

  insertStmt.run(
    randomUUID(),
    u.username,
    hashPassword(u.password),
    u.email,
    u.firstName,
    u.lastName,
    u.role,
  );
  created++;
}

console.log("");
console.log(`Created: ${created} | Updated: ${updated}`);
console.log("");
console.log("Login credentials:");
for (const u of demoUsers) {
  console.log(`- ${u.role}: ${u.username} / ${u.password}`);
}

console.log("");
console.log("Tip: run with: npx tsx script/seed-demo-users.ts");
