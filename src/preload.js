const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  saveToken: (token) => ipcRenderer.send('save-token', token),
  clearToken: () => ipcRenderer.send('clear-token'),
  getUsageData: () => ipcRenderer.send('get-usage-data'),
  
  onShowTokenInput: (callback) => ipcRenderer.on('show-token-input', callback),
  onTokenSaved: (callback) => ipcRenderer.on('token-saved', callback),
  onTokenCleared: (callback) => ipcRenderer.on('token-cleared', callback),
  onTokenStatus: (callback) => ipcRenderer.on('token-status', callback),
  onUsageDataUpdated: (callback) => ipcRenderer.on('usage-data-updated', callback),
  
  openExternal: (url) => {
    const { shell } = require('electron');
    shell.openExternal(url);
  }
});
