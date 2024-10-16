const { contextBridge, ipcRenderer } = require('electron'); //can not use import here

contextBridge.exposeInMainWorld('electronAPI', {
  submitPassword: (password) => ipcRenderer.send('password-submitted', password),
});
