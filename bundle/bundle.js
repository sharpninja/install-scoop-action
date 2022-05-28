/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 880:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core = __importStar(__webpack_require__(999));
const fs = __importStar(__webpack_require__(147));
const follow_redirects_1 = __webpack_require__(953);
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
                            const { execSync } = __webpack_require__(81);
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


/***/ }),

/***/ 999:
/***/ ((module) => {

module.exports = require("@actions/core");

/***/ }),

/***/ 953:
/***/ ((module) => {

module.exports = require("follow-redirects");

/***/ }),

/***/ 81:
/***/ ((module) => {

module.exports = require("child_process");

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(880);
/******/ 	
/******/ })()
;