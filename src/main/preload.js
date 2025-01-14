const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setPassword: (password) => ipcRenderer.invoke('set-password', password),
  verifyPassword: (password) => ipcRenderer.invoke('verify-password', password),
  saveNotes: (password, text) => ipcRenderer.invoke('save-notes', { password, text }),
  loadNotes: (password) => ipcRenderer.invoke('load-notes', password),
  loginWithTouchId: () => ipcRenderer.invoke('loginWithTouchId')
});
