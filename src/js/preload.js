const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submitPassword: (data) => ipcRenderer.send('password-submitted', data),
    verifyPassword: (password) => ipcRenderer.send('verify-master-password', password),
    onPasswordIncorrect: (callback) => ipcRenderer.on('password-incorrect', callback),
    sendText: (text) => ipcRenderer.send('save-text', text),
    //create function for send an asynchronous request to main.js
    loadText: () => ipcRenderer.invoke('request-load-text'),
    encryptText: (text) => ipcRenderer.invoke('encrypt-text', text),
});