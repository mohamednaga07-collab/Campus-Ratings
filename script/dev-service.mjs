import { spawn, execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PID_FILE = path.join(ROOT, ".dev-watchdog.pid");
const LOG_DIR = path.join(ROOT, "logs");
const LOG_FILE = path.join(LOG_DIR, "dev-watchdog.log");

function isWin() {
  return process.platform === "win32";
}

function readPid() {
  try {
    const text = fs.readFileSync(PID_FILE, "utf8").trim();
    const pid = Number(text);
    return Number.isFinite(pid) ? pid : null;
  } catch {
    return null;
  }
}

function pidRunning(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function ensureLogsDir() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
}

function startDetached() {
  ensureLogsDir();

  const out = fs.openSync(LOG_FILE, "a");
  const err = fs.openSync(LOG_FILE, "a");

  const nodeExe = process.execPath;
  const watchdogPath = path.join(ROOT, "script", "dev-watchdog.mjs");

  const child = spawn(nodeExe, [watchdogPath], {
    detached: true,
    stdio: ["ignore", out, err],
    windowsHide: true,
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  child.unref();
  fs.writeFileSync(PID_FILE, String(child.pid), "utf8");
  console.log(`[dev-service] started watchdog (pid=${child.pid})`);
  console.log(`[dev-service] logs: ${path.relative(ROOT, LOG_FILE)}`);
}

function stopDetached() {
  const pid = readPid();
  if (!pid) {
    console.log("[dev-service] no pid file; nothing to stop");
    return;
  }

  if (!pidRunning(pid)) {
    console.log(`[dev-service] watchdog pid ${pid} not running; cleaning pid file`);
    try { fs.unlinkSync(PID_FILE); } catch {}
    return;
  }

  console.log(`[dev-service] stopping watchdog (pid=${pid})...`);

  if (isWin()) {
    // Kill process tree on Windows
    execFileSync("taskkill", ["/PID", String(pid), "/T", "/F"], { stdio: "ignore" });
  } else {
    process.kill(pid, "SIGTERM");
  }

  try { fs.unlinkSync(PID_FILE); } catch {}
  console.log("[dev-service] stopped");
}

const cmd = process.argv[2];
if (cmd === "start") {
  const pid = readPid();
  if (pid && pidRunning(pid)) {
    console.log(`[dev-service] already running (pid=${pid})`);
    console.log(`[dev-service] logs: ${path.relative(ROOT, LOG_FILE)}`);
  } else {
    startDetached();
  }
} else if (cmd === "stop") {
  stopDetached();
} else if (cmd === "status") {
  const pid = readPid();
  if (pid && pidRunning(pid)) {
    console.log(`[dev-service] running (pid=${pid})`);
  } else {
    console.log("[dev-service] not running");
  }
  console.log(`[dev-service] logs: ${path.relative(ROOT, LOG_FILE)}`);
} else {
  console.log("Usage: node script/dev-service.mjs <start|stop|status>");
  process.exit(1);
}
