import { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain, dialog, systemPreferences } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import fs from "fs";
import sjcl from "sjcl";
import moment from "moment";
import keytar from "keytar";
import notifier from "node-notifier";

const __dirname = dirname(fileURLToPath(import.meta.url));
const userDataPath = app.getPath('userData');
const passwordFilePath = path.join(userDataPath, 'master-password.json');
const ENCODING = 'utf8';

console.log('User Data Path:', userDataPath);
console.info('Password File Path:', passwordFilePath);

let welcomeView; // variable for the welcome page
let mainView; // variable for the main text edit page
let passwordInputWindow;  // variable for the password input window
let tray = null; // Tray should be initialized properly

// Disable hardware acceleration before app is ready
app.disableHardwareAcceleration();

// load env variables
dotenv.config();
if (!process.env.USER_ENCRYPTED_FILE_PATH) {
  console.error('Error: USER_ENCRYPTED_FILE_PATH is not defined in the .env file.');
  console.warn('Please check your .env file and set the USER_ENCRYPTED_FILE_PATH variable.');
  process.exit(1);
}

// function checks if master password exists
function masterPasswordExists() {
  return fs.existsSync(passwordFilePath);
}

async function authenticateWithTouchID() {

  if(process.platform === "darwin" && systemPreferences.canPromptTouchID()){
    systemPreferences.promptTouchID('Please put your finger on it for authentication"').then(async success => {
      console.log("Authentication via TouchID was successful!");
      const password = await keytar.getPassword("Password-Frog", "macos-password");

      if(password) {
        console.log("The password from the Keychain has been found");
        return password;
      } else {
        console.log("The password not found")
      }
    }).catch(err => {
      console.log("Authentication via Touch ID failed")
      console.log(err)
    })
  } else {
    console.log("TouchID is not available on this platform");
  }
}

async function loadPasswordAndVerify() {
  const password = await authenticateWithTouchID();

  if (password) {
    console.log('Используем пароль для входа в приложение:', password);

    // Pass the password to the main process for further verification
    ipcMain.emit('verify-master-password', password);
  } else {
    console.log('Не удалось получить пароль через Touch ID');
  }
}

const renderMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.floor(width * 0.8); // 80% of screen width
  const windowHeight = Math.floor(height * 0.8); // 80% of screen height
  const encryptedFilePath = path.resolve(process.env.USER_ENCRYPTED_FILE_PATH);  // path for Encrypted file, check .env
  const PASSWORD_DATA = getMasterPassword();
  const { hashedPassword } = PASSWORD_DATA;
  const GET_DATE = getCurrentDatetime();

  mainView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "./src/js/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: 1
    },
    resizable: true,
    fullscreenable: true,
  });

  if (process.env.APP_ENV === "local") {
    mainView.webContents.openDevTools();
  }

  mainView.setMinimumSize(200, 200);
  mainView.loadFile("./src/windows/main/index.html");

  // Handle close event for the main window
  mainView.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainView.hide(); // Hide the main window instead of closing
    }
  });

  function getCurrentDatetime() {
    return moment();
  }

  function getMasterPassword() {
    return JSON.parse(fs.readFileSync(passwordFilePath, ENCODING));
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
      console.error(`Error during ${isEncrypting ? 'encryption' : 'decryption'}: ${error} at ${GET_DATE}`);
      app.isQuitting = true;
      app.quit();
    }
  }

  ipcMain.handle('request-load-text', async () => {
    try {
      if (fs.existsSync(encryptedFilePath)) {
        const ENCRYPTED_TEXT_READ = fs.readFileSync(encryptedFilePath, ENCODING);
        return encryptOrDecryptText(hashedPassword, ENCRYPTED_TEXT_READ, false); // return unencrypted text
      }
      return '';
    } catch (error) {
      console.error(`Error decryption: ${error} at ${GET_DATE}`);
      app.isQuitting = true;
      app.quit();
    }
  });


  ipcMain.on('save-and-encrypt-text', async (event, text) => {
    try {
      const encryptedFilePath = path.resolve(process.env.USER_ENCRYPTED_FILE_PATH);
      const userFilesDir = path.dirname(encryptedFilePath); // Папка, в которой должен быть файл

      // Check directory and create it if it not
      if (!fs.existsSync(userFilesDir)) {
          fs.mkdirSync(userFilesDir, { recursive: true }); // Параметр { recursive: true } создаст все промежуточные каталоги
          console.info(`Directory created at: ${userFilesDir}`);
      }

      const ENCRYPTED_TEXT = encryptOrDecryptText(hashedPassword, text, true);

      fs.writeFileSync(encryptedFilePath, ENCRYPTED_TEXT, ENCODING);
      console.info(`Encrypted text has been saved to ${encryptedFilePath}\nDate: ${GET_DATE}`);

      notifier.notify({
        title: 'Save and Encrypt Successfulу!',
        message: 'The text has been saved and encrypted',
        sound: true,
        wait: true
      })

    } catch (error) {
      console.error(`Error during save and encryption: ${error}\nDate the error occurred: ${GET_DATE}`);
      dialog.showMessageBox({
        type: 'error',
        title: 'Error',
        message: 'There was an error saving or encrypting the text.'
      });
    }
  });
};

const renderPasswordWindow = () => {
  const windowWidth = 600;
  const windowHeight = 600;

  welcomeView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "./src/js/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: false,
    fullscreenable: false,
  });

  if (process.env.APP_ENV === "local") {
    welcomeView.webContents.openDevTools();
  }

  welcomeView.loadFile("./src/windows/createMasterPassword/createMasterPassword.html");

  // Handle close event for the password window
  welcomeView.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      welcomeView.hide(); // Hide the welcome window instead of closing
    }
  });
};

app.whenReady().then(() => {
  if (masterPasswordExists()) {
    renderPasswordInputWindow();
    loadPasswordAndVerify();
  } else {
      renderPasswordWindow();
  }

  // Create Tray icon
  const iconPath = path.join(__dirname, "./src/icons/frogIconTemplate.png");
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });

  tray = new Tray(icon);

  tray.on('click', () => {
    const currentView = mainView || welcomeView;
    if (currentView && !currentView.isDestroyed()) {
        currentView.isVisible() ? currentView.hide() : currentView.show();
    }
    tray.closeContextMenu();
  });

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Close Frog-app",
      type: "normal",
      click: () => {
        app.isQuitting = true; // for close app in cotext menu
        if (mainView) {
          mainView.close();
        }
        app.quit();
      },
    },
  ]);

  tray.on("right-click", () => {
    tray.popUpContextMenu(contextMenu);
  });

  tray.setContextMenu(contextMenu);
  tray.setToolTip("Frog-app.");

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        if (masterPasswordExists()) {
          renderPasswordInputWindow();
        } else {
            renderPasswordWindow();
        }
    }
  });
});

// Quit the app when all windows are closed (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC handling for the password submission
ipcMain.on('password-submitted', (event, data) => {
  console.info('Password data received:', data);

  try {
      // Store the hashed password and salt
      fs.writeFileSync(passwordFilePath, JSON.stringify(data));

      if (welcomeView) {
          welcomeView.close();
          welcomeView = null;
      }
      renderMainWindow();
  } catch (error) {
      console.error('Error saving master password:', error);
  }
});

ipcMain.on('verify-master-password', (event, enteredPassword) => {
  try {
      const data = JSON.parse(fs.readFileSync(passwordFilePath));
      const { hashedPassword, salt } = data;
      const iterations = 10000;

      // Hash the entered password with the stored salt
      const enteredHashedPasswordBits = sjcl.misc.pbkdf2(enteredPassword, sjcl.codec.hex.toBits(salt), iterations, 256);
      const enteredHashedPasswordHex = sjcl.codec.hex.fromBits(enteredHashedPasswordBits);

      if (enteredHashedPasswordHex === hashedPassword) {
          if (passwordInputWindow) {
              passwordInputWindow.close();
              passwordInputWindow = null;
          }
          renderMainWindow();
      } else {
          event.reply('password-incorrect');
      }
  } catch (error) {
      console.error('Error verifying master password:', error);
  }
});

function renderPasswordInputWindow() {
  passwordInputWindow = new BrowserWindow({
      width: 600,
      height: 600,
      webPreferences: {
          preload: path.join(__dirname, "./src/js/preload.js"),
          nodeIntegration: false,
          contextIsolation: true,
      },
      resizable: false,
      fullscreenable: false,
  });

  if (process.env.APP_ENV === "local") {
    passwordInputWindow.webContents.openDevTools();
  }

  passwordInputWindow.loadFile("./src/windows/passwordInput/passwordInput.html");

  // Handle close event for the password input window
  passwordInputWindow.on("close", (event) => {
      if (!app.isQuitting) {
          event.preventDefault();
          passwordInputWindow.hide(); // Hide the window instead of closing
      }
  });
}
