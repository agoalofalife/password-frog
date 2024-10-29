import { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain, dialog } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";
import fs from "fs";
import sjcl from 'sjcl';

const __dirname = dirname(fileURLToPath(import.meta.url));


let welcomeView; // variable for the welcome page
let mainView; // variable for the main text edit page
let tray = null; // Tray should be initialized properly
let userPassword; // variable for save password

// load env variables
dotenv.config();
if (!process.env.USER_FILE_PATH) {
  console.error('Error: USER_FILE_PATH is not defined in the .env file.');
  console.log('Please check your .env file and set the USER_FILE_PATH variable.');
  process.exit(1);
}

const renderMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.floor(width * 0.8); // 80% of screen width
  const windowHeight = Math.floor(height * 0.8); // 80% of screen height
  // Path for dir with txt file
  const userFilesDir = path.dirname(process.env.USER_FILE_PATH);
  const filePath = path.resolve(process.env.USER_FILE_PATH);

  mainView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
  mainView.loadFile("index.html");

  // Handle close event for the main window
  mainView.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainView.hide(); // Hide the main window instead of closing
    }
  });

  (function createFileIfNotExists() {
    if (!fs.existsSync(userFilesDir)) {
      fs.mkdirSync(userFilesDir);
    }

    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "", "utf8");

      console.log(`File created at: ${filePath}`);

      //Add message with a greeting if the user has opened the application for the first time
      dialog.showMessageBox(welcomeView, {
        title: "Welcome to Frogg-app",
        message: "File has been created.",
        type: "info"
      });
    }
  })();

  try {  ipcMain.on('save-text', (event, text) => {
    fs.writeFile(filePath, text, () => {
      dialog.showMessageBox(welcomeView, {
        message: "File has been saved.",
        type: "info"
      });
    });
  });
  } catch(err) {
    dialog.showMessageBox(welcomeView, {
      message: err.message,
      type: "info"
    });
  }
  
  //read file and show it in app
  ipcMain.handle('request-load-text', () => {
    return fs.readFileSync(filePath, "utf8");
  });

  //Defines a handler for an asynchronous request sent from the renderer to the main process
  ipcMain.handle('encrypt-text', (event, text) => {
    const ENCRYPTED = sjcl.encrypt(userPassword, text);
    const ECTRYPTED_FILE_PATH = path.join(userFilesDir, "encrypted_file.txt");
    fs.writeFileSync(ECTRYPTED_FILE_PATH, ENCRYPTED, "utf8");
    
    dialog.showMessageBox(welcomeView, {
        message: "File encrypted!",
        type: "info"
    });
  });
};

const renderPasswordWindow = () => {
  const windowWidth = 600;
  const windowHeight = 600;

  welcomeView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: false,
    fullscreenable: false,
  });

  if (process.env.APP_ENV === "local") {
    welcomeView.webContents.openDevTools();
  }

  welcomeView.loadFile("passwordWindow.html");

  // Handle close event for the password window
  welcomeView.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      welcomeView.hide(); // Hide the welcome window instead of closing
    }
  });
};

app.whenReady().then(() => {
  renderPasswordWindow();

  // Create Tray icon
  const iconPath = path.join(__dirname, "icons", "frogIconTemplate.png");
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
    if (BrowserWindow.getAllWindows().length === 0) renderPasswordWindow();
  });
});

// Quit the app when all windows are closed (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// IPC handling for the password submission
ipcMain.on('password-submitted', (event, password) => {
  console.log('Password received:', password);
  userPassword = password; // saved password
  if (welcomeView) {
    welcomeView.close();
    welcomeView = null;
  }
  renderMainWindow();
});
