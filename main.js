import { app, BrowserWindow, screen, Tray, Menu, nativeImage, nativeTheme } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

// load env variables
dotenv.config();

const createWindow = () => {
  // Get the primary display (the main screen the app will open on)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  // Set width and height as percentages of the screen's size
  const windowWidth = Math.floor(width * 0.8); // 80% of screen width
  const windowhHeight = Math.floor(height * 0.8); // 80% of screen height

  return new BrowserWindow({
    width: windowWidth,
    height: windowhHeight,
    webPreferences: {
      nodeIntegration: true,
      zoomFactor: 1,
    },
    resizable: true, // Ensures the window can be resized
    fullscreenable: true, // Allow fullscreen
  });
};

app.whenReady().then(() => {
  const window = createWindow();

  // Only open DevTools in local environment!
  if (process.env.APP_ENV === "local") {
    window.webContents.openDevTools();
  }

  window.setMinimumSize(200, 200);

  window.loadFile("index.html");

  //add event for hide and close app
  window.on("close", (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });

  // Add icon for Tray bar
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  /*use template images for a menu bar (Tray) icon, so it can adapt to both light and dark menu bars.
  On platforms that support high pixel density displays (such as Apple Retina), we can append @2x after image's base 
  filename to mark it as a 2x scale high resolution image. */
  const iconPath = path.join(__dirname, "icons", "frogIconTemplate.png");
  const icon = nativeImage.createFromPath(iconPath);
  icon.resize({ width: 16, height: 16 });
  let tray = new Tray(icon);

  //Add function hide and show when y double click on ison WITHOUT contextMenu
  //I dont know how but with "CLICK" ITS WORK BUT WITH "DOUBLE-CLICK" NOT WORK, mb conflict with contextMenu?
  tray.on("click", () => {
    window.isVisible() ? window.hide() : window.show();
  });

  //Add cont menu for click on Tray bar icon
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Frog-app",
      type: "normal",
      click: () => {
        window.show();
      },
    },
    { label: "Options", type: "normal" }, //if it will be? + add event
    {
      label: "Close Frog-app",
      type: "normal",
      //Add event for button 'Close'
      click: () => {
        app.isQuitting = true;
        window.close();
      },
    },
  ]);

  tray.setToolTip("Frog-app.");
  tray.setContextMenu(contextMenu);
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
