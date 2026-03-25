#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const readline = require("readline");
const crypto = require("crypto");

const PKG_VERSION = require("../package.json").version;
const PLUGIN_NAME = "ba-workflow";
const MARKETPLACE = "ba-workflow-marketplace";
const PLUGIN_KEY = `${PLUGIN_NAME}@${MARKETPLACE}`;
const CLAUDE_DIR = path.join(os.homedir(), ".claude");
const PLUGINS_DIR = path.join(CLAUDE_DIR, "plugins");
const CACHE_DIR = path.join(PLUGINS_DIR, "cache", MARKETPLACE, PLUGIN_NAME);
const INSTALLED_JSON = path.join(PLUGINS_DIR, "installed_plugins.json");
const SETTINGS_JSON = path.join(CLAUDE_DIR, "settings.json");
const KNOWN_MARKETPLACES_JSON = path.join(
  PLUGINS_DIR,
  "known_marketplaces.json"
);

// Encrypted package bundled in the npm package
const ENCRYPTED_ZIP = path.join(__dirname, "..", "ba-plugin.zip.enc");

// ── Uninstall ──────────────────────────────────────────────────────────────
const isUninstall =
  process.argv.includes("--uninstall") || process.argv.includes("-u");

if (isUninstall) {
  if (fs.existsSync(CACHE_DIR)) {
    fs.rmSync(CACHE_DIR, { recursive: true });
  }
  const legacyDir = path.join(PLUGINS_DIR, PLUGIN_NAME);
  if (fs.existsSync(legacyDir)) {
    fs.rmSync(legacyDir, { recursive: true });
  }

  if (fs.existsSync(INSTALLED_JSON)) {
    const data = JSON.parse(fs.readFileSync(INSTALLED_JSON, "utf8"));
    if (data.plugins && data.plugins[PLUGIN_KEY]) {
      delete data.plugins[PLUGIN_KEY];
      fs.writeFileSync(INSTALLED_JSON, JSON.stringify(data, null, 2) + "\n");
    }
  }

  if (fs.existsSync(SETTINGS_JSON)) {
    const settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, "utf8"));
    if (settings.enabledPlugins && settings.enabledPlugins[PLUGIN_KEY]) {
      delete settings.enabledPlugins[PLUGIN_KEY];
    }
    if (
      settings.extraKnownMarketplaces &&
      settings.extraKnownMarketplaces[MARKETPLACE]
    ) {
      delete settings.extraKnownMarketplaces[MARKETPLACE];
    }
    fs.writeFileSync(SETTINGS_JSON, JSON.stringify(settings, null, 2) + "\n");
  }

  // Clean up marketplace entries from previous versions
  if (fs.existsSync(KNOWN_MARKETPLACES_JSON)) {
    const km = JSON.parse(fs.readFileSync(KNOWN_MARKETPLACES_JSON, "utf8"));
    if (km[MARKETPLACE]) {
      delete km[MARKETPLACE];
      fs.writeFileSync(
        KNOWN_MARKETPLACES_JSON,
        JSON.stringify(km, null, 2) + "\n"
      );
    }
  }

  console.log("ba-workflow plugin removed.");
  process.exit(0);
}

// ── Helpers ────────────────────────────────────────────────────────────────

function promptPassword(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
    // Mask typed characters
    rl._writeToOutput = (str) => {
      if (str.includes(question)) {
        process.stdout.write(str);
      } else {
        process.stdout.write("*");
      }
    };
  });
}

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

function deriveKey(password) {
  const salt = crypto.createHash("sha256").update("analyst-ai-salt").digest();
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

function decryptBuffer(encryptedBuf, password) {
  const key = deriveKey(password);
  const iv = encryptedBuf.slice(0, IV_LENGTH);
  const data = encryptedBuf.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

// ── Main install ───────────────────────────────────────────────────────────

// ANSI color helpers (no dependencies)
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

function showBanner() {
  console.log(cyan(`
   █████╗ ███╗   ██╗ █████╗ ██╗  ██╗   ██╗███████╗████████╗     █████╗ ██╗
  ██╔══██╗████╗  ██║██╔══██╗██║  ╚██╗ ██╔╝██╔════╝╚══██╔══╝    ██╔══██╗██║
  ███████║██╔██╗ ██║███████║██║   ╚████╔╝ ███████╗   ██║       ███████║██║
  ██╔══██║██║╚██╗██║██╔══██║██║    ╚██╔╝  ╚════██║   ██║       ██╔══██║██║
  ██║  ██║██║ ╚████║██║  ██║███████╗██║   ███████║   ██║       ██║  ██║██║
  ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝   ╚══════╝   ╚═╝       ╚═╝  ╚═╝╚═╝
`));
  console.log(dim("    Business Analysis Workflow for Claude Code\n"));
}

async function main() {
  showBanner();
  console.log(`  analyst-ai installer v${PKG_VERSION}`);
  console.log("  Installing ba-workflow plugin for Claude Code...\n");

  // Check that the encrypted payload exists
  if (!fs.existsSync(ENCRYPTED_ZIP)) {
    console.error("❌ Encrypted plugin package not found.");
    console.error(`   Expected: ${ENCRYPTED_ZIP}`);
    process.exit(1);
  }

  // Get secret key from env or interactive prompt
  let secretKey = process.env.ANALYST_AI_KEY;
  if (secretKey) {
    console.log("Using secret key from ANALYST_AI_KEY environment variable.");
  } else {
    if (!process.stdin.isTTY) {
      console.error("❌ This installer requires an interactive terminal or ANALYST_AI_KEY env var.");
      process.exit(1);
    }

    secretKey = await promptPassword("🔑 Enter the secret key: ");
    console.log(); // newline after masked input

    if (!secretKey.trim()) {
      console.error("❌ Secret key cannot be empty.");
      process.exit(1);
    }
  }

  // Decrypt
  console.log("🔐 Validating secret key...");
  let zipBuffer;
  try {
    const encBuf = fs.readFileSync(ENCRYPTED_ZIP);
    zipBuffer = decryptBuffer(encBuf, secretKey);
  } catch (err) {
    console.error("\n❌ Invalid secret key. Please check and try again.");
    process.exit(1);
  }

  // Verify it's a valid zip (PK header)
  if (zipBuffer[0] !== 0x50 || zipBuffer[1] !== 0x4b) {
    console.error("\n❌ Invalid secret key. Decrypted data is not valid.");
    process.exit(1);
  }
  console.log("✅ Secret key validated!\n");

  // Write decrypted zip to temp file and extract
  const AdmZip = require("adm-zip");
  const tempZip = path.join(os.tmpdir(), `ba-plugin-${Date.now()}.zip`);

  try {
    fs.writeFileSync(tempZip, zipBuffer);
    const zip = new AdmZip(tempZip);

    // Prepare versioned install directory
    let version = "0.0.3";
    const pluginJsonEntry = zip.getEntry(".claude-plugin/plugin.json");
    if (pluginJsonEntry) {
      const pluginJson = JSON.parse(
        pluginJsonEntry.getData().toString("utf8")
      );
      version = pluginJson.version || version;
    }

    const versionDir = path.join(CACHE_DIR, version);
    if (fs.existsSync(versionDir)) {
      fs.rmSync(versionDir, { recursive: true });
    }
    fs.mkdirSync(versionDir, { recursive: true });

    console.log("📦 Extracting plugin files...");
    zip.extractAllTo(versionDir, true);

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
      },
    ];
    fs.writeFileSync(
      INSTALLED_JSON,
      JSON.stringify(installedData, null, 2) + "\n"
    );

    // Enable plugin and register marketplace in settings.json
    let settings = {};
    if (fs.existsSync(SETTINGS_JSON)) {
      settings = JSON.parse(fs.readFileSync(SETTINGS_JSON, "utf8"));
    }

    if (!settings.enabledPlugins) settings.enabledPlugins = {};
    settings.enabledPlugins[PLUGIN_KEY] = true;

    // Remove any stale local marketplace entries from previous versions
    if (settings.extraKnownMarketplaces && settings.extraKnownMarketplaces[MARKETPLACE]) {
      delete settings.extraKnownMarketplaces[MARKETPLACE];
    }

    fs.writeFileSync(
      SETTINGS_JSON,
      JSON.stringify(settings, null, 2) + "\n"
    );

    // Register marketplace with GitHub source (same pattern as official plugins)
    const marketplaceDir = path.join(PLUGINS_DIR, "marketplaces", MARKETPLACE);
    let knownMarketplaces = {};
    if (fs.existsSync(KNOWN_MARKETPLACES_JSON)) {
      knownMarketplaces = JSON.parse(
        fs.readFileSync(KNOWN_MARKETPLACES_JSON, "utf8")
      );
    }
    knownMarketplaces[MARKETPLACE] = {
      source: {
        source: "github",
        repo: "sandeepmehta2155/ba-workflow",
      },
      installLocation: marketplaceDir,
      lastUpdated: now,
    };
    fs.writeFileSync(
      KNOWN_MARKETPLACES_JSON,
      JSON.stringify(knownMarketplaces, null, 2) + "\n"
    );

    // Clone marketplace repo if not already present
    if (!fs.existsSync(path.join(marketplaceDir, ".git"))) {
      fs.mkdirSync(marketplaceDir, { recursive: true });
      try {
        execSync(
          `git clone https://github.com/sandeepmehta2155/ba-workflow.git "${marketplaceDir}"`,
          { stdio: "pipe" }
        );
        console.log("Marketplace registered from GitHub.");
      } catch (e) {
        console.log("Note: Marketplace clone skipped (repo may be private).");
        console.log("Plugin files installed locally — commands will still work.");
      }
    }

    // Clean up legacy install path
    const legacyDir = path.join(PLUGINS_DIR, PLUGIN_NAME);
    if (fs.existsSync(legacyDir)) {
      fs.rmSync(legacyDir, { recursive: true });
      console.log("Cleaned up legacy install location.");
    }

    console.log(`\n✅ ba-workflow plugin v${version} installed at: ${versionDir}`);
    console.log("Plugin registered and enabled in Claude Code settings.");
    console.log("\nRestart Claude Code, then run:");
    console.log("  /ba-workflow:init");
  } finally {
    // Clean up temp file
    if (fs.existsSync(tempZip)) {
      fs.unlinkSync(tempZip);
    }
  }
}

main().catch((err) => {
  console.error("❌ Installation failed:", err.message);
  process.exit(1);
});
