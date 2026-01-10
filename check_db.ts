
import { sqliteStorage } from "./server/sqliteStorage";
import { db } from "./server/db"; // Assuming I can access db instance or I'll just use sqlite directly if needed, but safer to use storage if possible. 
// Actually sqliteStorage imports db from local file in that file. I can't easily import it if it's not exported.
// `server/sqliteStorage.ts` creates `const db = new Database(...)`. It doesn't export raw db.
// But it exports `sqliteStorage` object.

async function check() {
  console.log("Checking activity logs...");
  const logs = await sqliteStorage.getActivityLogs(10);
  console.log("Logs found:", logs.length);
  console.log(logs);
  
  const stats = await sqliteStorage.getStats();
  console.log("Stats:", stats);
}

check();
