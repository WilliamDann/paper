const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
let win

function createNotecard (name="New Card", desc="Press tab to enter edit mode") {
  win = new BrowserWindow({width: 400, height: 250, frame: false, skipTaskbar: true})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/html/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Tell the notecard who it is
  win.webContents.on('did-finish-load', () => {
    win.webContents.send("identity-assign", JSON.stringify(
      {name: name, desc: desc}
    ))
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
  message = JSON.parse(message)
  createNotecard(message.name, message.desc);
})