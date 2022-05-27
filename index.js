const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const shell = "powershell";

try {
    // File URL
    const url = 'https://get.scoop.sh';

    const debug = core.getInput('debug') === true;
    const asAdmin = core.getInput('allow-install-as-admin');
    const ext = core.getInput('extension').trim('.');
    const scriptName = `.\\install-scoop.${ext}`;

    const executeWith = ext === 'ps1' ? shell : ext === 'bat' ? 'cmd' : '/bin/bash';

    // Download the file
    https.get(url, (res) => {
        if (debug) {
            console.log(res)
        }

        // Open file in local filesystem
        const file = fs.createWriteStream(scriptName);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close((err) => {
                if (err) { console.error('error', err); }
                else {
                    if (debug) {
                        console.log(fs.readFileSync(scriptName))
                    }
                    const { execSync } = require('child_process');

                    const command = `${executeWith} ${scriptName} ${asAdmin ? ' -RunAsAdmin' : ''}`;

                    console.log(`Executing: ${command}`);

                    const stdout = execSync(command);

                    console.log(`stdout.byteLength: ${stdout.byteLength}`);
                    console.log(`stdout: ${stdout.toString()}`);
                }
            });
        });

    }).on("error", (err) => {
        console.error("Error: ", err.message);
    });
} catch (e) {
    console.error(e);
}
