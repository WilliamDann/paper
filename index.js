const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const ipcMain = require('electron').ipcMain;
var fs = require('fs');
const Card = require('./app/card.js');
let win

// Load all the papers in windows
function loadPapers() {
  // Save files
  fs.readdir(path.join(__dirname, 'app/save'), (err, files) => {
    if (err) { throw err; }
    files.forEach(file => {
      Card.load(path.join(path.join(__dirname, 'app/save'), file), paper => {
        createPaper(paper.text, paper.saveID);
      });
    });
  }); 
}

function createPaper (text="Press tab to enter edit mode", saveID=null) {
  win = new BrowserWindow({width: 306, height: 396, frame: false})
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'app/html/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // win.toggleDevTools();
  // Tell the notecard who it is
  win.webContents.on('did-finish-load', () => {
    win.webContents.send("identity-assign", {text:text,saveID:saveID})
  })

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', () => { loadPapers() })
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
