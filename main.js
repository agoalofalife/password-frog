const { app, BrowserWindow, Tray, Menu, nativeImage } = require("electron");

let win;
let tray;

const createWindow = () => {
  //removed const to avoid conflicts and add let win upper 
    win = new BrowserWindow({
    width: 800,
    height: 600,
  });

  win.loadFile("index.html");
  //add event for hide and close app
  win.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      win.hide();
    }
  });
};


app.whenReady().then(() => {
  createWindow()

  // macOS apps generally continue running even without any windows open. 
  // Activating the app when no windows are available should open a new one.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })


  // Add icon for Tray bar
  const path = require('path');
  // for examle add patch for icon, it will be fixed. Check dir 'icons'
  const iconPath = path.join(__dirname, 'icons', 'frogIcon.jpg');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);
  //Add cont menu for click on Tray bar icon 
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Open Frog-app', type: 'normal', 
      click: () => {
        win.show();
      }
    },
    { label: 'Options', type: 'normal' },        //if it will be? + add event
    { label: 'Close Frog-app', type: 'normal',
      //Add event for button 'Close'
      click: () => {
        app.isQuitting = true;
        win.close();
      }
    },
  ])

  tray.setToolTip('Frog-app.')          //NEED TO TEST
  tray.setContextMenu(contextMenu)

  /*Function to open app if y use double-click on Tray-bar-icon
  ITS NOT WORK NEED TAKES TIME TO THINK 
  tray.on('double-click', () => {
    win.show();
  });*/
})

//Quit the app when all windows are closed (Windows & Linux)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})


