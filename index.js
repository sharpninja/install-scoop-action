const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const shell = "powershell";

try {
    // File URL
    const url = 'https://get.scoop.sh';

    const asAdmin = core.getInput('allow-install-as-admin');
    const ext = core.getInput('extension').trim('.');
    const scriptName = `.\\install-scoop.${ext}`;

    const executeWith = ext === 'ps1' ? shell : ext === 'bat' ? 'cmd' : '/bin/bash';

    // Download the file
    https.get(url, (res) => {

        // Open file in local filesystem
        const file = fs.createWriteStream(scriptName);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close((err) => {
                if (err) { console.error('error', err); }
                else {
                    const { execSync } = require('child_process');

                    const stdout = execSync(`${executeWith} ${scriptName} ${asAdmin ? ' -RunAsAdmin' : ''}`);

                    console.log('stdout ', stdout);
                }
            });
        });

    }).on("error", (err) => {
        console.error("Error: ", err.message);
    });
} catch (e) {
    console.error(e);
}
