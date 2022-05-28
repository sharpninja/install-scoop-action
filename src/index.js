"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const follow_redirects_1 = require("follow-redirects");
const shell = "powershell";
let _debug = false;
function log(...toLog) {
    console.log('[Install Scoop][info]', ...toLog);
}
function errr(...toLog) {
    console.error('[Install Scoop]', ...toLog);
}
function dbg(...toLog) {
    if (_debug) {
        console.log('[Install Scoop][debug]', ...toLog);
    }
}
function run() {
    return __awaiter(this, void 0, void 0, function* () {
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
            follow_redirects_1.https.get(url, (res) => {
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
    });
}
