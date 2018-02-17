var remote = require('electron').remote;
var windowManager = remote.require('electron-window-manager');

var fs = require('fs');

var text = null;

// Export the paper to the specified format
function exportPaper(callback) {
    var format = document.getElementById('method').options[document.getElementById('method').selectedIndex].value;

    text = text.replace(/<br>/g, '\n');
    switch(format) {
        case null:
            throw new Error("No Format!");
        break;
        case 'txt':
            text = text.replace(/#/g, '');
            text = text.replace(/\*\*/g, '');
            text = text.replace(/__/g, '');
            text = text.replace(/_/g, '');
            
            fs.writeFile("export.txt", text, (err) => {
                if (err) throw err;
                callback();
            });
        break;
        case 'raw_txt':
            fs.writeFile("export.txt", text, (err) => {
                if (err) throw err;
                callback();
            });
        break;
        case 'md':
            fs.writeFile("export.md", text, (err) => {
                if (err) throw err;
                callback();
            });
        break;
    }
}

var got = false;
// When the parent tries to assign data to the window
windowManager.bridge.on('parent-data-assign', event => {
    if (!got) {
        text = event.data;
    }
});