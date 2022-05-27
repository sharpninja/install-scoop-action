const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');
const https = require('https');
const shell = "powershell";

let _debug = false;

function log(toLog) {
    console.log('[Install Scoop][info]', toLog);
}

function err(toLog) {
    console.error('[Install Scoop]', toLog);
}

function dbg(toLog) {
    if (_debug) {
        console.log('[Install Scoop][debug]', toLog);
    }
}

try {
    // File URL
    const url = 'https://get.scoop.sh';

    _debug = core.getInput('debug') === "true";
    log(`core.getInput('debug'): ${core.getInput('debug')}`)
    log(`_debug: ${_debug}`)
    const asAdmin = core.getInput('allow-install-as-admin');
    const ext = core.getInput('extension').trim('.');
    const scriptName = `.\\install-scoop.${ext}`;

    const executeWith = ext === 'ps1' ? shell : ext === 'bat' ? 'cmd' : '/bin/bash';

    dbg("Debug mode enabled.");

    // Download the file
    https.get(url, (res) => {
        const body = res.read();
        dbg(body)

        // Open file in local filesystem
        const file = fs.createWriteStream(scriptName);

        // Write data into local file
        res.pipe(file);

        // Close the file
        file.on('finish', () => {
            file.close((err) => {
                if (err) { console.error('error', err); }
                else {
                    dbg(fs.readFileSync(scriptName).toString())
                    const { execSync } = require('child_process');

                    const command = `${executeWith} ${scriptName} ${asAdmin ? ' -RunAsAdmin' : ''}`;

                    log(`Executing: ${command}`);

                    const stdout = execSync(command);

                    log(`stdout.byteLength: ${stdout.byteLength}`);
                    log(`stdout: ${stdout.toString()}`);
                }
            });
        });

    }).on("error", (err) => {
        console.error("Error: ", err.message);
    });
} catch (e) {
    console.error(e);
}
