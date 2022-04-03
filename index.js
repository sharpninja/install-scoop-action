const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');

try{
// File URL
const url = 'https://get.scoop.sh';

const asAdmin = core.getInput('allow-install-as-admin');
const ext = core.getInput('extension').trim('.');

// Download the file
https.get(url, (res) => {

    // Open file in local filesystem
    const file = fs.createWriteStream(`~\install-scoop.${ext}`);

    // Write data into local file
    res.pipe(file);

    // Close the file
    file.on('finish', () => {
        file.close();
        console.log(`~\install-scoop.${ext} downloaded!`);
    });

}).on("error", (err) => {
    console.error("Error: ", err.message);
});
} catch(e) {
    console.error(e);
}
