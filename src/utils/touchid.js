import { app, systemPreferences } from 'electron';
import fs from 'fs-extra';
import path from 'path';

const userDataPath = app.getPath('userData');
const passwordFile = path.join(userDataPath, 'password.enc');
const ENCODING = 'utf8';


async function authenticateWithTouchID() {
  if (process.platform === 'darwin') {  
    try {
      await systemPreferences.promptTouchID('Please authenticate with your fingerprint');
      const content = JSON.parse(fs.readFileSync(passwordFile, ENCODING));
      const { hashedKey } = content;
      return hashedKey;  
    } catch (err) {
      console.error('Touch ID authentication failed:', err);
      return null;  
    }
  } else {
    console.log('Touch ID is not available on this platform');
    return null; 
  }
}

export { authenticateWithTouchID };