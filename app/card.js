var fs = require('fs');

class Card {
    constructor (text, saveID=null) {
        this.text = text;
        this.saveID = saveID;
    }
    
    // Save the card
    save(location) {
        fs.writeFile(location, JSON.stringify(this), () => {});
    }

    // Load the card
    static load(location, callback) {
        fs.readFile(location, (err, data) => {
            if (err) throw err;
            var data = JSON.parse(data);
            callback(new Card(data.text, data.saveID));
        });
    }

    static loadSync(location) {
        return fs.readFileSync(location);
    }

    // Delete the card
    delete(location, callback) {
        fs.unlink(location, () => { callback(); })
    }
} module.exports = Card;