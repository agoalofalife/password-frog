import crypto from 'crypto'; 

const ALGORITHM = 'aes-256-gcm'; 
const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const IV_LENGTH = 16;

// Derive key from password
function deriveKey(password, salt) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey);
    });
  });
}

// Hash the password for storage (you can store a derived key as a "hash")
async function hashPassword(password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const derivedKey = await deriveKey(password, salt);
  return {
    salt: salt.toString('hex'),
    hashedKey: derivedKey.toString('hex')
  };
}

// Verify password
async function verifyPassword(password, saltHex, hashedKeyHex) {
  const salt = Buffer.from(saltHex, 'hex');
  const derivedKey = await deriveKey(password, salt);
  return crypto.timingSafeEqual(derivedKey, Buffer.from(hashedKeyHex, 'hex'));
}

// Encrypt text with password
async function encryptText(text, password) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const key = await deriveKey(password, salt);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  const authTag = cipher.getAuthTag();

  return {
    salt: salt.toString('hex'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    data: encrypted
  };
}

// Decrypt text with password
async function decryptText(encData, password) {
  const salt = Buffer.from(encData.salt, 'hex');
  const iv = Buffer.from(encData.iv, 'hex');
  const authTag = Buffer.from(encData.authTag, 'hex');
  const key = await deriveKey(password, salt);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encData.data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export { hashPassword, verifyPassword, encryptText, decryptText };
