import { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));


let welcomeView; // variable for the welcome page
let mainView; // variable for the main text edit page
let tray = null; // Tray should be initialized properly

// load env variables
dotenv.config();

const renderMainWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const windowWidth = Math.floor(width * 0.8); // 80% of screen width
  const windowHeight = Math.floor(height * 0.8); // 80% of screen height

  mainView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: 1
    },
    resizable: true,
    fullscreenable: true,
  });

  if (process.env.APP_ENV === 'local') {
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
};

const renderPasswordWindow = () => {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  const windowWidth = 600;
  const windowHeight = 600;

  welcomeView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    resizable: false,
    fullscreenable: false,
  });

  if (process.env.APP_ENV === 'local') {
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
    if (mainView) { // Check if mainView exists
      if (mainView.isVisible()) {
        mainView.hide();
      } else {
        mainView.show();
      }
    } else {
      console.error("mainView is not initialized");
    }
  });
  

  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Close Frog-app",
      type: "normal",
      click: () => {
        app.quit(); // Close the app on clicking the menu
      },
    },
  ]);

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
  if (welcomeView) {
    welcomeView.close();
    welcomeView = null;
  }
  renderMainWindow();
});
