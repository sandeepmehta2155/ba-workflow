#!/usr/bin/env node

/**
 * Packages and encrypts the plugin files into ba-plugin.zip.enc
 *
 * Usage:
 *   node scripts/encrypt-zip.js
 *
 * This collects all plugin content (agents, commands, skills, templates,
 * config, .claude-plugin metadata, etc.), zips them, encrypts the zip
 * with a password you provide, and writes ba-plugin.zip.enc into the
 * project root (which is included in the published npm package).
 */

const readline = require("readline");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");
const { encryptFile } = require("../lib/encrypt");

const PROJECT_ROOT = path.join(__dirname, "..");

// Load .env file from project root if it exists
const envPath = path.join(PROJECT_ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = (match[2] || "").replace(/^["']|["']$/g, "");
    }
  }
}
const OUTPUT_ENC = path.join(PROJECT_ROOT, "ba-plugin.zip.enc");
const TEMP_ZIP = path.join(PROJECT_ROOT, "ba-plugin.zip.tmp");

// Directories and files to include in the encrypted package
const INCLUDE_DIRS = [
  "agents",
  "commands",
  "skills",
  "templates",
  ".claude-plugin",
];
const INCLUDE_FILES = ["config.md", "elicitation-methods.md"];

function prompt(question, hidden) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (hidden) {
      // Mask input for password
      const { stdout } = process;
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
      rl._writeToOutput = (str) => {
        if (str.includes(question)) {
          stdout.write(str);
        } else {
          stdout.write("*");
        }
      };
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

async function main() {
  console.log("\n🔐 analyst-ai — Package Encryption Tool\n");

  let password = process.env.ANALYST_AI_KEY;
  if (password) {
    console.log("Using secret key from ANALYST_AI_KEY environment variable.");
  } else {
    password = await prompt("Enter secret key: ", true);
    console.log(); // newline after masked input
    if (!password.trim()) {
      console.error("❌ Secret key cannot be empty.");
      process.exit(1);
    }

    const confirm = await prompt("Confirm secret key: ", true);
    console.log();
    if (password !== confirm) {
      console.error("❌ Keys do not match.");
      process.exit(1);
    }
  }

  // Build zip
  console.log("📦 Creating plugin archive...");
  const zip = new AdmZip();

  for (const dir of INCLUDE_DIRS) {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(dirPath)) {
      zip.addLocalFolder(dirPath, dir);
      console.log(`   + ${dir}/`);
    }
  }

  for (const file of INCLUDE_FILES) {
    const filePath = path.join(PROJECT_ROOT, file);
    if (fs.existsSync(filePath)) {
      zip.addLocalFile(filePath);
      console.log(`   + ${file}`);
    }
  }

  zip.writeZip(TEMP_ZIP);

  // Encrypt
  console.log("\n🔒 Encrypting archive...");
  encryptFile(TEMP_ZIP, OUTPUT_ENC, password);

  // Cleanup temp zip
  fs.unlinkSync(TEMP_ZIP);

  console.log(`\n✅ Encrypted package written to: ba-plugin.zip.enc`);
  console.log(
    "\n⚠️  Share the secret key only with authorized users."
  );
  console.log("   Run 'npm publish' to publish the package with the encrypted payload.\n");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
