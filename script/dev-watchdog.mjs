import { spawn } from "node:child_process";

const RESTART_DELAY_MS = 1500;

let child = null;
let shuttingDown = false;

function start() {
  if (shuttingDown) return;

  console.log("[watchdog] starting dev server...");

  const isWin = process.platform === "win32";
  const command = isWin ? "cmd.exe" : "npm";
  const args = isWin ? ["/d", "/s", "/c", "npm", "run", "dev"] : ["run", "dev"];

  child = spawn(command, args, {
    stdio: "inherit",
    windowsHide: false,
    env: {
      ...process.env,
      NODE_ENV: "development",
    },
  });

  child.on("exit", (code, signal) => {
    child = null;
    if (shuttingDown) return;

    console.log(
      `[watchdog] dev server exited (code=${code ?? "?"}, signal=${signal ?? "?"}). Restarting in ${RESTART_DELAY_MS}ms...`,
    );

    setTimeout(start, RESTART_DELAY_MS);
  });
}

function stop() {
  shuttingDown = true;
  if (!child) process.exit(0);

  console.log("[watchdog] stopping dev server...");
  child.kill("SIGTERM");

  // Force-exit if it doesn't stop quickly
  setTimeout(() => process.exit(0), 2000).unref();
}

process.on("SIGINT", stop);
process.on("SIGTERM", stop);

start();
