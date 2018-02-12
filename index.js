const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
let win

function createNotecard (text="Press tab to enter edit mode") {
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

app.on('ready', () => { createNotecard() })
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (win === null) {
    createNotecard()
  }
})

ipcMain.on('notecard-create', (event, message) => {
  createNotecard(message);
})

ipcMain.on('toggle-dev-tools', () => {
  win.toggleDevTools();
});
