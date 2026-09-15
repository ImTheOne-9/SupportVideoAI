const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('creatorUtilsDesktop', {
  getGeminiKey: () => ipcRenderer.invoke('secrets:get-gemini-key'),
  setGeminiKey: value => ipcRenderer.invoke('secrets:set-gemini-key', value),
  selectDirectory: () => ipcRenderer.invoke('system:select-directory'),
});
