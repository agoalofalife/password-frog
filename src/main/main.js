import { app, BrowserWindow, ipcMain, Tray, nativeImage, Menu, systemPreferences } from 'electron';
import path from 'path';
import fs from 'fs-extra';
import * as cryptoUtil from '../utils/crypto.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from "dotenv";
import moment from 'moment';
import notifier from "node-notifier";

// Disable hardware acceleration before app is ready
app.disableHardwareAcceleration();

const __dirname = dirname(fileURLToPath(import.meta.url));
const userDataPath = app.getPath('userData');
const passwordFilePath = path.join(userDataPath, 'master-password.json');
const ENCODING = 'utf8';

// load env variables
dotenv.config();
if (!process.env.USER_ENCRYPTED_FILE_PATH) {
  console.error('Error: USER_ENCRYPTED_FILE_PATH is not defined in the .env file.');
  console.warn('Please check your .env file and set the USER_ENCRYPTED_FILE_PATH variable.');
  process.exit(1);
}

console.log('User Data Path:', userDataPath);
console.info('Password File Path:', passwordFilePath);

let mainWindow;
const passwordFile = path.join(userDataPath, 'password.enc');
const encryptedFilePath = path.resolve(process.env.USER_ENCRYPTED_FILE_PATH);
const userFilesDir = path.dirname(encryptedFilePath);
let tray = null; // Tray should be initialized properly

function createWindow(view) {
  mainWindow = new BrowserWindow({
    width: 800, 
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });
  
  // Run the development server at localhost:4000
  mainWindow.loadURL('http://localhost:4000/#/' + view);
}

app.whenReady().then(() => {
  // Check if password file exists
  if (!fs.existsSync(passwordFile)) {
    // No password set yet => show password setup view
    createWindow('passwordSetup');
  } else {
    // Password file exists => show password prompt view
    createWindow('passwordPrompt');
  }

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow('passwordPrompt');
  });

  const iconPath = path.join(__dirname, "../renderer/assets/frogIconTemplate.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);

  tray.on(process.platform === 'linux' ? 'click' : 'double-click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
    tray.closeContextMenu();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Close Frog-app",
      type: "normal",
      click: () => {
        app.isQuitting = true; // for close app in cotext menu
        if (mainWindow) {
          mainWindow.close();
        }
        app.quit();
      },
    },
  ]);

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Frog-App");
});

//Touch ID
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

ipcMain.handle('loginWithTouchId', async () => {
  const passwordHash = await authenticateWithTouchID();
  return passwordHash; 
});

ipcMain.handle('set-password', async (event, password) => {
  const { salt, hashedKey } = await cryptoUtil.hashPassword(password);
  const data = { salt, hashedKey };
  fs.writeFileSync(passwordFile, JSON.stringify(data));
  return true;
});

ipcMain.handle('verify-password', async (event, password) => {
  const content = JSON.parse(fs.readFileSync(passwordFile, ENCODING));
  const isValid = await cryptoUtil.verifyPassword(password, content.salt, content.hashedKey);
  return isValid;
});

ipcMain.handle('save-notes', async (event, { password, text }) => {
  try {
    if (!fs.existsSync(userFilesDir)) {
      fs.mkdirSync(userFilesDir, { recursive: true });
      console.info(`Directory created at: ${userFilesDir}`);
    }

    const encryptedText = cryptoUtil.encryptOrDecryptText(password, text, true);

    fs.writeFileSync(encryptedFilePath, encryptedText, ENCODING);
    console.info(`Encrypted text has been saved to ${encryptedFilePath}\nTime: ${moment()}`);
    notifier.notify({
      title: 'Save and Encrypt Successfulу!',
      message: 'The text has been saved and encrypted',
      sound: true,
      wait: true
    })
    return true;
  } catch (error) {
    console.error(`Error during save and encryption: ${error.message}\nTime: ${moment()}`);
    throw new Error('Failed to save and encrypt notes.');
  }
});

ipcMain.handle('load-notes', async (event, password) => {
  try {
    if (!fs.existsSync(encryptedFilePath)) {;
      return '';
    }

    const dencryptedText = fs.readFileSync(encryptedFilePath, ENCODING);

    const decryptedText = cryptoUtil.encryptOrDecryptText(password, dencryptedText, false); 
    console.info('Decryption successful.');
    return decryptedText;
  } catch (error) {
    console.error(`Error during decryption: ${error.message}\nTime: ${moment()}`);
    throw new Error("Failed to load and decrypt notes");
  }
});
