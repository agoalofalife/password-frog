const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    submitPassword: (data) => ipcRenderer.send('password-submitted', data),
    verifyPassword: (password) => ipcRenderer.send('verify-master-password', password),
    onPasswordIncorrect: (callback) => ipcRenderer.on('password-incorrect', callback),
    sendAndEncrypt: (text) => ipcRenderer.send('save-and-encrypt-text', text), 
    loadText: () => ipcRenderer.invoke('request-load-text'),
});