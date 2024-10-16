import { app, BrowserWindow, screen, Tray, Menu, nativeImage, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));


let welcomeView; // variable for the welcome page
let mainView; // variable for the main text edit page


// load env variables
dotenv.config();


const renderMainWindow = () => {

  // Get the primary display (the main screen the app will open on)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set width and height as percentages of the screen's size
  const windowWidth = Math.floor(width * 0.8); // 80% of screen width
  const windowHeight = Math.floor(height * 0.8); // 80% of screen height

  mainView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Use the new __dirname
      nodeIntegration: false,
      contextIsolation: true,
      zoomFactor: 1
    },
    resizable: true, // Ensures the window can be resized
    fullscreenable: true, // Allow fullscreen
  });
};

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
  const windowWidth = 600
  const windowHeight = 600

  welcomeView = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
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

  window.setMinimumSize(200, 200);

  window.loadFile("index.html");

  //add event for hide and close app
  window.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });

  /*use template images for a menu bar (Tray) icon, so it can adapt to both light and dark menu bars.
  On platforms that support high pixel density displays (such as Apple Retina), we can append @2x after image's base
  filename to mark it as a 2x scale high resolution image. */
  const iconPath = path.join(__dirname, "icons", "frogIconTemplate.png");
  const icon = nativeImage.createFromPath(iconPath);
  icon.resize({ width: 16, height: 16 });
  let tray = new Tray(icon);

  tray.on('click', () => {
    window.isVisible() ? window.hide() : window.show();
    tray.closeContextMenu();
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(contextMenu)
  })

  //Add cont menu for click on Tray bar icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Close Frog-app",
      type: "normal",
      click: () => {
        app.exit(0);
      },
    },
  ]);

  //add Workaround for Linux for context menu
  if (process.platform === "linux") {
    tray.setContextMenu(contextMenu);
  }
  
  tray.setToolTip("Frog-app.");
});

// macOS apps generally continue running even without any windows open.
// Activating the app when no windows are available should open a new one.
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

//Quit the app when all windows are closed (Windows & Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
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
