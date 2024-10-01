import { app, BrowserWindow, screen } from "electron";
import dotenv from 'dotenv';

// load env variables
dotenv.config();

const createWindow = () => {

  // Get the primary display (the main screen the app will open on)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set width and height as percentages of the screen's size
  const winWidth = Math.floor(width * 0.8); // 80% of screen width
  const winHeight = Math.floor(height * 0.8); // 80% of screen height

  const win = new BrowserWindow({
    width: winWidth,
    height: winHeight,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1
    },
    resizable: true, // Ensures the window can be resized
    fullscreenable: true, // Allow fullscreen
  });

  // Only open DevTools in local environment!
  if (process.env.APP_ENV === 'local') {
    win.webContents.openDevTools(); 
  }

  win.setMinimumSize(200, 200)

  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow()

  // macOS apps generally continue running even without any windows open. 
  // Activating the app when no windows are available should open a new one.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
});

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});
