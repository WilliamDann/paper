const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
let win

function createPaper (text="Press tab to enter edit mode") {
  win = new BrowserWindow({width: 306, height: 396, frame: false})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/html/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Tell the notecard who it is
  win.webContents.on('did-finish-load', () => {
    win.webContents.send("identity-assign", "Press Tab to enter edit mode")
  })

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => { createPaper() })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createPaper()
  }
})

ipcMain.on('paper-create', (event, message) => {
  createPaper(message);
})

ipcMain.on('toggle-dev-tools', () => {
  win.toggleDevTools();
});
