const { contextBridge, ipcRenderer } = require('electron'); //can not use import here

contextBridge.exposeInMainWorld('electronAPI', {
  submitPassword: (password) => ipcRenderer.send('password-submitted', password),
  sendText: (text) => ipcRenderer.send('save-text', text),
  //create function for send an asynchronous request to main.js
  loadText: () => ipcRenderer.invoke('request-load-text'),
  textEncrypt: (password) => ipcRenderer.invoke('encrypt-text', password),
});
