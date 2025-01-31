import crypto from 'crypto'; 
import sjcl from 'sjcl';
import moment from 'moment';

const KEY_LENGTH = 32;
const SALT_LENGTH = 16;
const GET_CURRENT_DATE = moment();

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

//add function for encrypt and unencrypt file for code's flexibility 
function encryptOrDecryptText(password, text, isEncrypting) {
  try {
    if (isEncrypting) {
      return sjcl.encrypt(password, text);
    } else {
      return sjcl.decrypt(password, text);
    }
  } catch (error) {
    console.error(`Error during ${isEncrypting ? 'encryption' : 'decryption'}: ${error} \nTime: ${GET_CURRENT_DATE}`);
    app.isQuitting = true; 
    app.quit(); 
  }
}

export { hashPassword, verifyPassword, encryptOrDecryptText };