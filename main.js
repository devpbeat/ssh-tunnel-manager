// main.js
const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
const db = require('./db');
const tunnel = require('./tunnel');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });

  win.loadFile('renderer/index.html');
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('get-profiles', () => db.getProfiles());
ipcMain.handle('add-profile', (event, profile) => db.addProfile(profile));
ipcMain.handle('start-tunnel', (event, profile) => {
  const pid = tunnel.startTunnel(profile);
  new Notification({ title: 'SSH Tunnel', body: `Tunnel started for ${profile.name}` }).show();
  return pid;
});
ipcMain.handle('stop-tunnel', (event, profileId) => {
  tunnel.stopTunnel(profileId);
  new Notification({ title: 'SSH Tunnel', body: `Tunnel stopped` }).show();
});