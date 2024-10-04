import { app, BrowserWindow, screen, ipcMain } from "electron";
import dotenv from 'dotenv';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));


let welcomeView; // variable for the welcome page
let mainView; // variable for the main text edit page

// load env variables
dotenv.config();

const renderMainWindow = () => {

  // Get the primary display (the main screen the app will open on)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set width and height as percentages of the screen's size
  const winWidth = Math.floor(width * 0.8); // 80% of screen width
  const winHeight = Math.floor(height * 0.8); // 80% of screen height

  mainView = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use the new __dirname
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: 1
    },
    resizable: true, // Ensures the window can be resized
    fullscreenable: true, // Allow fullscreen
  });

  // Only open DevTools in local environment!
  if (process.env.APP_ENV === 'local') {
    mainView.webContents.openDevTools(); 
  }

  mainView.setMinimumSize(200, 200)

  mainView.loadFile("index.html");
};

const renderPasswordWindow = () => {

  // Get the primary display (the main screen the app will open on)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set width and height as percentages of the screen's size
  const winWidth = 600
  const winHeight = 600

  welcomeView = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use preload script
      nodeIntegration: false, // Disable nodeIntegration for security
      contextIsolation: true, // Ensure contextIsolation is enabled
    },
    resizable: false, // Ensures the window can be resized
    fullscreenable: false, // Allow fullscreen
  });

  // Only open DevTools in local environment!
  if (process.env.APP_ENV === 'local') {
    welcomeView.webContents.openDevTools(); 
  }

  welcomeView.loadFile("passwordWindow.html");
};

app.whenReady().then(() => {
  renderPasswordWindow()

  // macOS apps generally continue running even without any windows open. 
  // Activating the app when no windows are available should open a new one.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) renderPasswordWindow()
  })
});

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});


ipcMain.on('password-submitted', (event, password) => {
  console.log('Password received:', password);
  // Close the password window
  if (welcomeView) {
    welcomeView.close();
    welcomeView = null;
  }
  // Open the main window
  renderMainWindow();
});
