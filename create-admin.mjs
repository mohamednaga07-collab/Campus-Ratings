import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = path.join(__dirname, "dev.db");
const db = new Database(dbPath);

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function createAdminUser() {
  try {
    const username = "admin";
    const password = "admin123";
    const email = "admin@profrate.com";
    
    // Check if admin already exists
    const existing = db.prepare("SELECT * FROM users WHERE username = ? OR email = ?").get(username, email);
    
    if (existing) {
      console.log("⚠️  Admin user already exists!");
      console.log("   Username:", existing.username);
      console.log("   Email:", existing.email);
      console.log("   Role:", existing.role);
      
      // Update to admin if not already
      if (existing.role !== "admin") {
        db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(existing.id);
        console.log("✅ Updated existing user to admin role");
      }
      return;
    }
    
    // Hash password
    const hashedPassword = hashPassword(password);
    
    // Create admin user
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO users (id, username, password, email, firstName, lastName, role, createdAt, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `).run(id, username, hashedPassword, email, "Admin", "User", "admin");
    
    console.log("✅ Admin user created successfully!");
    console.log("");
    console.log("📋 Login Credentials:");
    console.log("   Username: admin");
    console.log("   Password: admin123");
    console.log("   Email: admin@profrate.com");
    console.log("");
    console.log("🔐 Go to http://localhost:5000 and login with these credentials");
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

createAdminUser();
