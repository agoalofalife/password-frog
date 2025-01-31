const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  setPassword: (password, hint) => ipcRenderer.invoke('set-password', password, hint),
  verifyPassword: (password) => ipcRenderer.invoke('verify-password', password),
  saveNotes: (password, text) => ipcRenderer.invoke('save-notes', { password, text }),
  loadNotes: (password) => ipcRenderer.invoke('load-notes', password),
  loginWithTouchId: () => ipcRenderer.invoke('loginWithTouchId'),
  getHint: () => ipcRenderer.invoke('get-hint')
});
