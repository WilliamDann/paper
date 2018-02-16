const ipc = require('electron').ipcRenderer;
const showdown = require('showdown');
var path = require('path');

var remote = require('electron').remote;
var windowManager = remote.require('electron-window-manager');

var edit = false;
var identity = null;

var oldText = "";

var keymap = {17:false, 66:false, 73:false, 84:false}

function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}

document.addEventListener('keydown', event => {
    if (event.keyCode in keymap) {
        keymap[event.keyCode] = true;
    }


    // Tab
    if (event.keyCode == 9) {
        event.preventDefault();
        toggleEdit();
        // Every key press render the markdown if not edit
        if (!edit) {
            renderText();
        }
    }
    
    // Backspace
    if (event.keyCode == 8 && !edit) {
        if (identity.saveID) {
            identity.delete(path.join(__dirname, '../save/save' + identity.saveID + ".json"))
        }
        exit();
    }

    // n
    if (event.keyCode == 78 && !edit) {
        windowManager.bridge.emit('create-window', {text:'# New Paper <br> Press tab to edit'});
    }

    // Editor shortcuts
    if (edit) {
        // Ctl+B
        if (keymap[17] && keymap[66]) {
            insertTextAtCursor("**");
        }
        // Ctl+I
        if (keymap[17] && keymap[73]) {
            insertTextAtCursor("_");
        }
        // Ctl+T
        if (keymap[17] && keymap[84]) {
            insertTextAtCursor("#");
        }
    }
});

document.addEventListener('keyup', event => {
    if (event.keyCode in keymap) {
        keymap[event.keyCode] = false;
    }
});

// Assign an identity to the card
function assign(id) {
    identity = id;
    document.getElementById("text").innerHTML = id.text;
}

// Toggle edit mode
function toggleEdit() {
    if (!edit) {
        var text  = document.getElementById("text");
        
        oldText = oldText.replace(/(?:\r\n|\r|\n)/g, '<br />');
        text.innerHTML = oldText;
        
        text.setAttribute("contentEditable", true);
        text.style.setProperty("-webkit-app-region", "no-drag");
    } else {
        var text  = document.getElementById("text");
        
        text.setAttribute("contentEditable", false);
        text.style.setProperty("-webkit-app-region", "drag");
        
        identity.text  = text.innerHTML;
        
        // Save files
        if (identity.saveID === null) {
            fs.readdir(path.join(__dirname, '../save'), (err, files) => {
                if (err) { alert("Saving Error!"); }
                identity.saveID = files.length;
                identity.save(path.join(__dirname, '../save/save' + files.length + ".json"));
            });
        } else {
            identity.save(path.join(__dirname, '../save/save' + identity.saveID + ".json"));
        }

        assign(identity);
    }
    
    edit = !edit;
}

// Exit the program
function exit() {
    if (edit) {
        toggleEdit();
    } else {
        window.close();
    }
}

var converter = new showdown.Converter({simpleLineBreaks:true});
// Render text in the box
function renderText() {
    var box = document.getElementById("text");
    oldText = box.innerText;

    box.innerHTML = converter.makeHtml(box.innerText);
}

var got = false;
// When this window is given an identity
windowManager.bridge.on("identity-assign", event => {
    if (!got) {
        assign(new Card(event.text, event.saveID));
        renderText();
        got = true;
    }
})

