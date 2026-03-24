#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const REPO = "https://github.com/sandeepmehta2155/ba-workflow.git";
const PLUGIN_DIR = path.join(os.homedir(), ".claude", "plugins", "ba-workflow");

const isUninstall = process.argv.includes("--uninstall") || process.argv.includes("-u");

if (isUninstall) {
  if (fs.existsSync(PLUGIN_DIR)) {
    fs.rmSync(PLUGIN_DIR, { recursive: true });
    console.log("ba-workflow plugin removed.");
  } else {
    console.log("ba-workflow plugin is not installed.");
  }
  process.exit(0);
}

console.log("Installing ba-workflow plugin for Claude Code...\n");

if (fs.existsSync(PLUGIN_DIR)) {
  console.log("Plugin directory already exists. Updating...");
  execSync("git pull origin main", { cwd: PLUGIN_DIR, stdio: "inherit" });
} else {
  fs.mkdirSync(path.dirname(PLUGIN_DIR), { recursive: true });
  execSync(`git clone ${REPO} "${PLUGIN_DIR}"`, { stdio: "inherit" });
}

console.log("\nba-workflow plugin installed at: " + PLUGIN_DIR);
console.log("\nTo activate, run in Claude Code:");
console.log("  /ba-workflow:init");
