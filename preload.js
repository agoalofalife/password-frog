const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submitPassword: (data) => ipcRenderer.send('password-submitted', data),
    verifyPassword: (password) => ipcRenderer.send('verify-master-password', password),
    onPasswordIncorrect: (callback) => ipcRenderer.on('password-incorrect', callback),
});
