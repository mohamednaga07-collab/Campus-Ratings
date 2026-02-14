import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

let pool: pg.Pool | undefined;
let db: any;

if (!process.env.DATABASE_URL) {
  console.log("⚠️  Warning: DATABASE_URL not set. storage will fall back to SQLite.");
  db = null;
  pool = undefined;
} else {
  console.log("✓ Using PostgreSQL database");

  try {
    const dbUrl = new URL(process.env.DATABASE_URL);
    console.log(`✓ Connecting to database at: ${dbUrl.hostname}`);
  } catch (e) {
    console.log("✓ Connecting to database (URL parsing failed)");
  }

  // Always use SSL for external connections (required by Render, Neon, etc.)
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000, 
  });
  
  pool.connect((err, client, release) => {
    if (err) {
      console.error("❌ Database connection failed:", err.message);
    } else {
      console.log("✅ Database connected successfully");
      release();
    }
  });
  
  db = drizzle(pool, { schema });
}

export { pool, db };
