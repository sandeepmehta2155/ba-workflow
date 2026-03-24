#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PKG_VERSION = require("../package.json").version;
const REPO = "https://github.com/sandeepmehta2155/ba-workflow.git";
const PLUGIN_NAME = "ba-workflow";
const MARKETPLACE = "ba-workflow-marketplace";
const PLUGIN_KEY = `${PLUGIN_NAME}@${MARKETPLACE}`;
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PLUGINS_DIR = path.join(CLAUDE_DIR, "plugins");
const CACHE_DIR = path.join(PLUGINS_DIR, "cache", MARKETPLACE, PLUGIN_NAME);
const INSTALLED_JSON = path.join(PLUGINS_DIR, "installed_plugins.json");
const SETTINGS_JSON = path.join(CLAUDE_DIR, "settings.json");
const KNOWN_MARKETPLACES_JSON = path.join(PLUGINS_DIR, "known_marketplaces.json");

const isUninstall = process.argv.includes("--uninstall") || process.argv.includes("-u");

if (isUninstall) {
  // Remove cached plugin files
  if (fs.existsSync(CACHE_DIR)) {
    fs.rmSync(CACHE_DIR, { recursive: true });
  }
  // Also remove legacy install path
  const legacyDir = path.join(PLUGINS_DIR, PLUGIN_NAME);
  if (fs.existsSync(legacyDir)) {
    fs.rmSync(legacyDir, { recursive: true });
  }

  // Remove from installed_plugins.json
  if (fs.existsSync(INSTALLED_JSON)) {
    const data = JSON.parse(fs.readFileSync(INSTALLED_JSON, "utf8"));
    if (data.plugins && data.plugins[PLUGIN_KEY]) {
      delete data.plugins[PLUGIN_KEY];
      fs.writeFileSync(INSTALLED_JSON, JSON.stringify(data, null, 2) + "\n");
    }
  }

  // Remove from settings.json enabledPlugins
  if (fs.existsSync(SETTINGS_JSON)) {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, "utf8"));
    if (settings.enabledPlugins && settings.enabledPlugins[PLUGIN_KEY]) {
      delete settings.enabledPlugins[PLUGIN_KEY];
    }
    if (settings.extraKnownMarketplaces && settings.extraKnownMarketplaces[MARKETPLACE]) {
      delete settings.extraKnownMarketplaces[MARKETPLACE];
    }
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 2) + "\n");
  }

  // Remove from known_marketplaces.json
  if (fs.existsSync(KNOWN_MARKETPLACES_JSON)) {
    const km = JSON.parse(fs.readFileSync(KNOWN_MARKETPLACES_JSON, "utf8"));
    if (km[MARKETPLACE]) {
      delete km[MARKETPLACE];
      fs.writeFileSync(KNOWN_MARKETPLACES_JSON, JSON.stringify(km, null, 2) + "\n");
    }
  }

  console.log("ba-workflow plugin removed.");
  process.exit(0);
}

console.log(`\nanalyst-ai installer v${PKG_VERSION}`);
console.log("Installing ba-workflow plugin for Claude Code...\n");

// Read version from plugin.json in repo (we'll get it after clone)
let version = "0.0.1";
let gitCommitSha = "";

// Clone or update into cache directory
// We clone into a temp version dir, then read the version from plugin.json
const tempCloneDir = path.join(CACHE_DIR, "_temp");

if (fs.existsSync(tempCloneDir)) {
  fs.rmSync(tempCloneDir, { recursive: true });
}

fs.mkdirSync(CACHE_DIR, { recursive: true });
execSync(`git clone --depth 1 ${REPO} "${tempCloneDir}"`, { stdio: "inherit" });

// Read version from the cloned plugin.json
const pluginJsonPath = path.join(tempCloneDir, ".claude-plugin", "plugin.json");
if (fs.existsSync(pluginJsonPath)) {
  const pluginJson = JSON.parse(fs.readFileSync(pluginJsonPath, "utf8"));
  version = pluginJson.version || version;
}

// Get git commit sha
try {
  gitCommitSha = execSync("git rev-parse HEAD", { cwd: tempCloneDir, encoding: "utf8" }).trim();
} catch (e) {
  gitCommitSha = "";
}

// Move to versioned directory
const versionDir = path.join(CACHE_DIR, version);
if (fs.existsSync(versionDir)) {
  fs.rmSync(versionDir, { recursive: true });
}
fs.renameSync(tempCloneDir, versionDir);

// Register in installed_plugins.json
let installedData = { version: 2, plugins: {} };
if (fs.existsSync(INSTALLED_JSON)) {
  installedData = JSON.parse(fs.readFileSync(INSTALLED_JSON, "utf8"));
}
if (!installedData.plugins) installedData.plugins = {};

const now = new Date().toISOString();
installedData.plugins[PLUGIN_KEY] = [
  {
    scope: "user",
    installPath: versionDir,
    version: version,
    installedAt: now,
    lastUpdated: now,
    gitCommitSha: gitCommitSha,
  },
];
fs.writeFileSync(INSTALLED_JSON, JSON.stringify(installedData, null, 2) + "\n");

// Register marketplace and enable plugin in settings.json
let settings = {};
if (fs.existsSync(SETTINGS_JSON)) {
  settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, "utf8"));
}

if (!settings.enabledPlugins) settings.enabledPlugins = {};
settings.enabledPlugins[PLUGIN_KEY] = true;

if (!settings.extraKnownMarketplaces) settings.extraKnownMarketplaces = {};
settings.extraKnownMarketplaces[MARKETPLACE] = {
  source: {
    source: "git",
    url: REPO,
  },
};

fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 2) + "\n");

// Register in known_marketplaces.json
let knownMarketplaces = {};
if (fs.existsSync(KNOWN_MARKETPLACES_JSON)) {
  knownMarketplaces = JSON.parse(fs.readFileSync(KNOWN_MARKETPLACES_JSON, "utf8"));
}
knownMarketplaces[MARKETPLACE] = {
  source: {
    source: "git",
    url: REPO,
  },
  installLocation: path.join(PLUGINS_DIR, "marketplaces", MARKETPLACE),
  lastUpdated: now,
};
fs.writeFileSync(KNOWN_MARKETPLACES_JSON, JSON.stringify(knownMarketplaces, null, 2) + "\n");

// Clean up legacy install path if it exists
const legacyDir = path.join(PLUGINS_DIR, PLUGIN_NAME);
if (fs.existsSync(legacyDir)) {
  fs.rmSync(legacyDir, { recursive: true });
  console.log("Cleaned up legacy install location.");
}

console.log(`\nba-workflow plugin v${version} installed at: ${versionDir}`);
console.log("Plugin registered and enabled in Claude Code settings.");
console.log("\nRestart Claude Code, then run:");
console.log("  /ba-workflow:init");
