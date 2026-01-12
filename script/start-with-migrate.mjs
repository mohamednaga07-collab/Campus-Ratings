#!/usr/bin/env node
// Auto-migrate script that runs before starting the server
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function migrate() {
  console.log('🔄 Running database migrations...');
  
  if (!process.env.DATABASE_URL) {
    console.log('⚠️  No DATABASE_URL found, skipping migrations (using SQLite)');
    return;
  }

  try {
    const { stdout, stderr } = await execAsync('npx drizzle-kit push --force');
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log('✅ Database migrations completed');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('⚠️  Continuing anyway - tables might already exist');
  }
}

migrate().then(() => {
  // Start the actual server
  console.log('🚀 Starting server...');
  import('../dist/index.cjs');
}).catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
