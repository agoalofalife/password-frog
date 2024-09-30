const { app, BrowserWindow } = require("electron");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1
    },
    resizable: true, // Ensures the window can be resized
    fullscreenable: true, // Allow fullscreen
  });

  // uncomment this to unlock chrome devtools
  // win.webContents.openDevTools()

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
})

// Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})