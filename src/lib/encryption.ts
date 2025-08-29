import crypto from "crypto";

export class EncryptionService {
  private static algorithm = "aes-256-cbc";

  private static getKey(): Buffer {
    const key =
      process.env.ENCRYPTION_KEY || "default-key-change-in-production";
    return crypto.createHash("sha256").update(key).digest();
  }

  /**
   * Validates that the encryption key is set
   */
  private static validateKey() {
    if (!process.env.ENCRYPTION_KEY) {
      console.warn(
        "ENCRYPTION_KEY not set in environment variables. Using default key."
      );
    }
  }

  /**
   * Encrypt sensitive data (like player names)
   */
  static encrypt(text: string): string {
    if (!text) return text;

    this.validateKey();

    try {
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipheriv(this.algorithm, this.getKey(), iv);

      let encrypted = cipher.update(text, "utf8", "hex");
      encrypted += cipher.final("hex");

      // Combine IV and encrypted data
      return iv.toString("hex") + ":" + encrypted;
    } catch (error) {
      console.error("Encryption error:", error);
      throw new Error("Failed to encrypt data");
    }
  }

  /**
   * Decrypt sensitive data
   */
  static decrypt(encryptedText: string): string {
    if (!encryptedText) return encryptedText;

    this.validateKey();

    try {
      const parts = encryptedText.split(":");
      if (parts.length !== 2) {
        throw new Error("Invalid encrypted data format");
      }

      const [ivHex, encrypted] = parts;
      const iv = Buffer.from(ivHex, "hex");
      const decipher = crypto.createDecipheriv(
        this.algorithm,
        this.getKey(),
        iv
      );

      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      console.error("Decryption error:", error);
      throw new Error("Failed to decrypt data");
    }
  }

  /**
   * Create a pseudonymized version of sensitive data for analytics
   */
  static pseudonymize(text: string): string {
    if (!text) return text;

    return crypto
      .createHash("sha256")
      .update(text + this.getKey().toString("hex"))
      .digest("hex")
      .substring(0, 8); // Return first 8 characters for readability
  }

  /**
   * Hash data for secure comparison without storing original
   */
  static hash(text: string): string {
    if (!text) return text;

    return crypto.createHash("sha256").update(text).digest("hex");
  }

  /**
   * Generate a secure random token
   */
  static generateToken(length: number = 32): string {
    return crypto.randomBytes(length).toString("hex");
  }
}
