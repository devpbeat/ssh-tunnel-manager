const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  addProfile: (profile) => ipcRenderer.invoke('add-profile', profile),
  startTunnel: (profile) => ipcRenderer.invoke('start-tunnel', profile),
  stopTunnel: (id) => ipcRenderer.invoke('stop-tunnel', id),
});