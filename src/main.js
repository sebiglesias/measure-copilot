const { app, BrowserWindow, Tray, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const Store = require('electron-store');
const GitHubAPI = require('./github-api');

const store = new Store();
let tray = null;
let window = null;
let githubAPI = null;

// Create the menu bar app
function createTray() {
  const iconPath = path.join(__dirname, 'assets', 'iconTemplate.png');
  tray = new Tray(iconPath);
  
  updateTrayMenu();
  
  tray.on('click', () => {
    if (window) {
      window.isVisible() ? window.hide() : window.show();
    } else {
      createWindow();
    }
  });
}

function updateTrayMenu(usageData = null) {
  let menuTemplate = [];
  
  if (usageData) {
    const { remaining, total, daily, dailyLimit, overLimit } = usageData;
    const percentUsed = ((total - remaining) / total * 100).toFixed(1);
    
    menuTemplate = [
      { label: `Copilot Usage: ${percentUsed}%`, enabled: false },
      { type: 'separator' },
      { label: `Remaining: ${remaining.toLocaleString()} / ${total.toLocaleString()}`, enabled: false },
      { label: `Today: ${daily.toLocaleString()} requests`, enabled: false },
      { label: `Daily Limit: ${dailyLimit.toLocaleString()}`, enabled: false },
      { label: overLimit ? '⚠️ Daily limit exceeded!' : '✓ Within daily limit', enabled: false },
      { type: 'separator' },
      { label: 'Refresh', click: () => refreshUsageData() },
      { type: 'separator' },
    ];
  } else {
    menuTemplate = [
      { label: 'Copilot Usage Monitor', enabled: false },
      { type: 'separator' },
      { label: 'Not connected to GitHub', enabled: false },
      { type: 'separator' },
    ];
  }
  
  menuTemplate.push(
    { label: 'Configure GitHub Token', click: () => showTokenDialog() },
    { label: 'Open Dashboard', click: () => createWindow() },
    { type: 'separator' },
    { label: 'Quit', click: () => app.quit() }
  );
  
  const contextMenu = Menu.buildFromTemplate(menuTemplate);
  tray.setContextMenu(contextMenu);
  
  // Update tray tooltip
  if (usageData) {
    const { remaining, total } = usageData;
    tray.setToolTip(`Copilot: ${remaining.toLocaleString()} / ${total.toLocaleString()} remaining`);
  } else {
    tray.setToolTip('Copilot Usage Monitor');
  }
}

function createWindow() {
  if (window) {
    window.show();
    return;
  }
  
  window = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    frame: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });
  
  window.loadFile(path.join(__dirname, 'index.html'));
  
  window.once('ready-to-show', () => {
    window.show();
  });
  
  window.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      window.hide();
    }
  });
}

async function showTokenDialog() {
  const result = await dialog.showMessageBox({
    type: 'info',
    title: 'GitHub Token Setup',
    message: 'Enter your GitHub Personal Access Token',
    detail: 'You need a GitHub token with "copilot" scope to access usage data.\n\nCreate one at: https://github.com/settings/tokens',
    buttons: ['Cancel', 'Enter Token']
  });
  
  if (result.response === 1) {
    createWindow();
    if (window) {
      window.webContents.send('show-token-input');
    }
  }
}

function sendUsageDataUpdate(targetWindow, data) {
  if (targetWindow) {
    targetWindow.send('usage-data-updated', data);
  } else if (window) {
    window.webContents.send('usage-data-updated', data);
  }
}

async function refreshUsageData(targetWindow = null) {
  const token = store.get('githubToken');
  
  if (!token) {
    updateTrayMenu(null);
    sendUsageDataUpdate(targetWindow, null);
    return;
  }
  
  if (!githubAPI) {
    githubAPI = new GitHubAPI(token, store);
  }
  
  try {
    const usageData = await githubAPI.getUsageData();
    updateTrayMenu(usageData);
    sendUsageDataUpdate(targetWindow, usageData);
  } catch (error) {
    console.error('Error fetching usage data:', error);
    updateTrayMenu(null);
    sendUsageDataUpdate(targetWindow, null);
  }
}

// IPC handlers
ipcMain.on('save-token', async (event, token) => {
  store.set('githubToken', token);
  githubAPI = new GitHubAPI(token, store);
  await refreshUsageData(event.sender);
  event.reply('token-saved');
});

ipcMain.on('get-usage-data', async (event) => {
  await refreshUsageData(event.sender);
});

ipcMain.on('clear-token', (event) => {
  store.delete('githubToken');
  githubAPI = null;
  updateTrayMenu(null);
  event.reply('token-cleared');
});

// App lifecycle
app.whenReady().then(() => {
  createTray();
  
  // Initial data fetch
  const token = store.get('githubToken');
  if (token) {
    refreshUsageData();
  }
  
  // Refresh every 5 minutes
  setInterval(() => {
    refreshUsageData();
  }, 5 * 60 * 1000);
});

app.on('before-quit', () => {
  app.isQuitting = true;
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

// Don't quit the app when all windows are closed (macOS menu bar app behavior)
app.on('activate', () => {
  if (!window) {
    createWindow();
  }
});
