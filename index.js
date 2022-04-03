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
            file.close();

            const { execSync } = require('child_process');
            // stderr is sent to stdout of parent process
            // you can set options.stdio if you want it to go elsewhere
            const stdout = execSync(`${executeWith} ${scriptName} ${asAdmin ? ' -RunAsAdmin' : ''}`);

            console.log('stdout ', child.stdout);
            if (child.error) { console.error('error', child.error); }
            if (child.stderr) { console.error('stderr ', child.stderr); }
        });

    }).on("error", (err) => {
        console.error("Error: ", err.message);
    });
} catch (e) {
    console.error(e);
}
