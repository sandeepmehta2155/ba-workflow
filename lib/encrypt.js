const crypto = require("crypto");
const fs = require("fs");

const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;

/**
 * Derives a 256-bit key from a password using PBKDF2
 */
function deriveKey(password) {
  const salt = crypto.createHash("sha256").update("analyst-ai-salt").digest();
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

/**
 * Encrypts a file using AES-256-CBC
 */
function encryptFile(inputPath, outputPath, password) {
  const key = deriveKey(password);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const input = fs.readFileSync(inputPath);

  const encrypted = Buffer.concat([iv, cipher.update(input), cipher.final()]);
  fs.writeFileSync(outputPath, encrypted);
}

/**
 * Decrypts a file using AES-256-CBC
 */
function decryptFile(inputPath, outputPath, password) {
  const key = deriveKey(password);
  const encrypted = fs.readFileSync(inputPath);

  const iv = encrypted.slice(0, IV_LENGTH);
  const encryptedData = encrypted.slice(IV_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  fs.writeFileSync(outputPath, decrypted);
}

module.exports = { encryptFile, decryptFile };
