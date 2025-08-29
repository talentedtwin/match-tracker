import { EncryptionService } from "../lib/encryption";

// Test encryption/decryption functionality
async function testEncryption() {
  console.log("Testing encryption service...");

  try {
    const originalText = "John Smith";
    const encrypted = EncryptionService.encrypt(originalText);
    const decrypted = EncryptionService.decrypt(encrypted);

    console.log("Original:", originalText);
    console.log("Encrypted:", encrypted);
    console.log("Decrypted:", decrypted);
    console.log("Match:", originalText === decrypted);

    // Test pseudonymization
    const pseudonym = EncryptionService.pseudonymize(originalText);
    console.log("Pseudonym:", pseudonym);

    // Test hashing
    const hash = EncryptionService.hash(originalText);
    console.log("Hash:", hash);
  } catch (error) {
    console.error("Encryption test failed:", error);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testEncryption();
}

export { testEncryption };
