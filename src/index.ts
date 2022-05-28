"use strict";
import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import { https } from 'follow-redirects';

const shell = "powershell";
let _debug = false;

function log(...toLog: (number | undefined | string | unknown)[]) {
    console.log('[Install Scoop][info]', ...toLog);
}
function errr(...toLog: (Error | number | undefined | string | unknown)[]) {
    console.error('[Install Scoop]', ...toLog);
}
function dbg(...toLog: (number | undefined | string | unknown)[]) {
    if (_debug) {
        console.log('[Install Scoop][debug]', ...toLog);
    }
}

async function run() {
    try {
        // File URL
        const url = 'https://get.scoop.sh';
        _debug = core.getInput('debug') === "true";
        log(`core.getInput('debug'): ${core.getInput('debug')}`);
        log(`_debug: ${_debug}`);
        const asAdmin = core.getInput('allow-install-as-admin');
        const ext = core.getInput('extension').replace(/[.]+$/, '');
        const scriptName = `.\\install-scoop.${ext}`;
        const executeWith = ext === 'ps1' ? shell : ext === 'bat' ? 'cmd' : '/bin/bash';
        dbg("Debug mode enabled.");
        // Download the file
        https.get(url, (res) => {
            const statusCode = res.statusCode;
            const statusMsg = res.statusMessage;
            dbg(statusCode, statusMsg);
            // Open file in local filesystem
            const file = fs.createWriteStream(scriptName);
            // Write data into local file
            res.pipe(file);
            // Close the file
            file.on('finish', () => {
                file.close((err) => {
                    if (err) {
                        console.error('error', err);
                    }
                    else {
                        const scr = fs.readFileSync(scriptName).toString();
                        dbg(scr === null || scr === void 0 ? void 0 : scr.length, scr);
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
            errr("Error: ", err.message);
        });
    }
    catch (e) {
        errr(e);
    }
}