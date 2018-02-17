const electron = require('electron');
const app = electron.app;
const windowManager = require('electron-window-manager');
const Card = require('./app/card');
const fs = require('fs');

// Create  a new paper
function createPaper(text="# Press tab to enter edit mode", saveID=null) {
  // Open a window
  var win = windowManager.open(null, 'Loading ...', '/app/html/index.html', 'default', null);

  
  win.content().on('did-finish-load', () => {
    windowManager.bridge.emit('identity-assign', {text:text, saveID:saveID}, win);
  })
}

// Create a new paper if asked
windowManager.bridge.on('create-window', (event) => {
  console.log(event);
  createPaper(event.text, event.saveID);
});

// When the application is ready
app.on('ready', function(){
    windowManager.init({});
    windowManager.templates.set('default', {
      'menu': null, frame:false, resizable:true, devMode:false, height:396, width:306
    });
    windowManager.templates.set('popup', {
      'menu': null, frame:false, resizable:true, devMode:false, height:200, width:250
    });
    
    fs.readdir("./app/save/", (err, files) => {
      files.forEach(file => {
        Card.load("./app/save/" + file, paper => {
          createPaper(paper.text, paper.saveID);
        });
      });
    });
});
