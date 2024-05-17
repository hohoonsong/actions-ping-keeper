require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

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
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

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
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

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
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
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
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
    readBodyBuffer() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                this.message.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                this.message.on('end', () => {
                    resolve(Buffer.concat(chunks));
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        try {
            return new URL(proxyVar);
        }
        catch (_a) {
            if (!proxyVar.startsWith('http://') && !proxyVar.startsWith('https://'))
                return new URL(`http://${proxyVar}`);
        }
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 5575:
/***/ ((module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

const picomatch = __nccwpck_require__(8569);
const normalizePath = __nccwpck_require__(5388);

/**
 * @typedef {(testString: string) => boolean} AnymatchFn
 * @typedef {string|RegExp|AnymatchFn} AnymatchPattern
 * @typedef {AnymatchPattern|AnymatchPattern[]} AnymatchMatcher
 */
const BANG = '!';
const DEFAULT_OPTIONS = {returnIndex: false};
const arrify = (item) => Array.isArray(item) ? item : [item];

/**
 * @param {AnymatchPattern} matcher
 * @param {object} options
 * @returns {AnymatchFn}
 */
const createPattern = (matcher, options) => {
  if (typeof matcher === 'function') {
    return matcher;
  }
  if (typeof matcher === 'string') {
    const glob = picomatch(matcher, options);
    return (string) => matcher === string || glob(string);
  }
  if (matcher instanceof RegExp) {
    return (string) => matcher.test(string);
  }
  return (string) => false;
};

/**
 * @param {Array<Function>} patterns
 * @param {Array<Function>} negPatterns
 * @param {String|Array} args
 * @param {Boolean} returnIndex
 * @returns {boolean|number}
 */
const matchPatterns = (patterns, negPatterns, args, returnIndex) => {
  const isList = Array.isArray(args);
  const _path = isList ? args[0] : args;
  if (!isList && typeof _path !== 'string') {
    throw new TypeError('anymatch: second argument must be a string: got ' +
      Object.prototype.toString.call(_path))
  }
  const path = normalizePath(_path, false);

  for (let index = 0; index < negPatterns.length; index++) {
    const nglob = negPatterns[index];
    if (nglob(path)) {
      return returnIndex ? -1 : false;
    }
  }

  const applied = isList && [path].concat(args.slice(1));
  for (let index = 0; index < patterns.length; index++) {
    const pattern = patterns[index];
    if (isList ? pattern(...applied) : pattern(path)) {
      return returnIndex ? index : true;
    }
  }

  return returnIndex ? -1 : false;
};

/**
 * @param {AnymatchMatcher} matchers
 * @param {Array|string} testString
 * @param {object} options
 * @returns {boolean|number|Function}
 */
const anymatch = (matchers, testString, options = DEFAULT_OPTIONS) => {
  if (matchers == null) {
    throw new TypeError('anymatch: specify first argument');
  }
  const opts = typeof options === 'boolean' ? {returnIndex: options} : options;
  const returnIndex = opts.returnIndex || false;

  // Early cache for matchers.
  const mtchers = arrify(matchers);
  const negatedGlobs = mtchers
    .filter(item => typeof item === 'string' && item.charAt(0) === BANG)
    .map(item => item.slice(1))
    .map(item => picomatch(item, opts));
  const patterns = mtchers
    .filter(item => typeof item !== 'string' || (typeof item === 'string' && item.charAt(0) !== BANG))
    .map(matcher => createPattern(matcher, opts));

  if (testString == null) {
    return (testString, ri = false) => {
      const returnIndex = typeof ri === 'boolean' ? ri : false;
      return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
    }
  }

  return matchPatterns(patterns, negatedGlobs, testString, returnIndex);
};

anymatch.default = anymatch;
module.exports = anymatch;


/***/ }),

/***/ 4608:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Curl = void 0;
const tslib_1 = __nccwpck_require__(9679);
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const events_1 = __nccwpck_require__(2361);
const string_decoder_1 = __nccwpck_require__(1576);
const assert_1 = tslib_1.__importDefault(__nccwpck_require__(9491));
const stream_1 = __nccwpck_require__(2781);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = __nccwpck_require__(7357);
const Easy_1 = __nccwpck_require__(1517);
const mergeChunks_1 = __nccwpck_require__(80);
const parseHeaders_1 = __nccwpck_require__(1920);
const CurlCode_1 = __nccwpck_require__(3625);
const CurlFeature_1 = __nccwpck_require__(5539);
const CurlPause_1 = __nccwpck_require__(5302);
const CurlWriteFunc_1 = __nccwpck_require__(9531);
const CurlReadFunc_1 = __nccwpck_require__(6426);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bindings = __nccwpck_require__(720);
const { Curl: _Curl, CurlVersionInfo } = bindings;
if (!process.env.NODE_LIBCURL_DISABLE_GLOBAL_INIT_CALL ||
    process.env.NODE_LIBCURL_DISABLE_GLOBAL_INIT_CALL !== 'true') {
    // We could just pass nothing here, CurlGlobalInitEnum.All is the default anyway.
    const globalInitResult = _Curl.globalInit(3 /* CurlGlobalInit.All */);
    (0, assert_1.default)(globalInitResult === 0 || 'Libcurl global init failed.');
}
const decoder = new string_decoder_1.StringDecoder('utf8');
// Handle used by curl instances created by the Curl wrapper.
const curlInstanceMap = new WeakMap();
/**
 * Wrapper around {@link "Easy".Easy | `Easy`} class with a more *nodejs-friendly* interface.
 *
 * This uses an internal {@link "Multi".Multi | `Multi`} instance allowing for asynchronous
 * requests.
 *
 * @public
 */
class Curl extends events_1.EventEmitter {
    /**
     * Whether this instance is closed or not ({@link close | `close()`} was called).
     *
     * Make sure to not change their value, otherwise unexpected behavior would happen.
     */
    get isOpen() {
        return this.handle.isOpen;
    }
    /**
     * @param cloneHandle {@link "Easy".Easy | `Easy`} handle that should be used instead of creating a new one.
     */
    constructor(cloneHandle) {
        super();
        /**
         * Whether this instance is running or not ({@link perform | `perform()`} was called).
         *
         * Make sure to not change their value, otherwise unexpected behavior would happen.
         *
         * This is marked as protected only with the TSDoc to not cause a breaking change.
         *
         * @protected
         */
        this.isRunning = false;
        /**
         * Stores current response payload.
         *
         * This will not store anything in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
         */
        this.chunks = [];
        /**
         * Current response length.
         *
         * Will always be zero in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
         */
        this.chunksLength = 0;
        /**
         * Stores current headers payload.
         *
         * This will not store anything in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
         */
        this.headerChunks = [];
        /**
         * Current headers length.
         *
         * Will always be zero in case {@link CurlFeature.NoDataStorage | `NoDataStorage`} flag is enabled
         */
        this.headerChunksLength = 0;
        /**
         * Currently enabled features.
         *
         * See {@link enable | `enable`} and {@link disable | `disable`}
         */
        this.features = CurlFeature_1.CurlFeature.Empty;
        // these are for stream handling
        // the streams themselves
        this.writeFunctionStream = null;
        this.readFunctionStream = null;
        // READFUNCTION / upload related
        this.streamReadFunctionCallbacksToClean = [];
        // a state machine would be better here than all these flags 🤣
        this.streamReadFunctionShouldEnd = false;
        this.streamReadFunctionShouldPause = false;
        this.streamReadFunctionPaused = false;
        this.streamWriteFunctionShouldPause = false;
        this.streamWriteFunctionPaused = false;
        this.streamWriteFunctionFirstRun = true;
        // common
        this.streamPauseNext = false;
        this.streamContinueNext = false;
        this.streamError = false;
        this.streamUserSuppliedProgressFunction = null;
        const handle = cloneHandle || new Easy_1.Easy();
        this.handle = handle;
        // callbacks called by libcurl
        handle.setOpt(Curl.option.WRITEFUNCTION, this.defaultWriteFunction.bind(this));
        handle.setOpt(Curl.option.HEADERFUNCTION, this.defaultHeaderFunction.bind(this));
        handle.setOpt(Curl.option.USERAGENT, Curl.defaultUserAgent);
        curlInstanceMap.set(handle, this);
    }
    /**
     * Callback called when an error is thrown on this handle.
     *
     * This is called from the internal callback we use with the {@link "Multi".Multi.onMessage | `onMessage`}
     *  method of the global {@link "Multi".Multi | `Multi`} handle used by all `Curl` instances.
     *
     * @protected
     */
    onError(error, errorCode) {
        this.resetInternalState();
        this.emit('error', error, errorCode, this);
    }
    /**
     * Callback called when this handle has finished the request.
     *
     * This is called from the internal callback we use with the {@link "Multi".Multi.onMessage | `onMessage`}
     *  method of the global {@link "Multi".Multi | `Multi`} handle used by all `Curl` instances.
     *
     * This should not be called in any other way.
     *
     * @protected
     */
    onEnd() {
        const isStreamResponse = !!(this.features & CurlFeature_1.CurlFeature.StreamResponse);
        const isDataStorageEnabled = !isStreamResponse && !(this.features & CurlFeature_1.CurlFeature.NoDataStorage);
        const isDataParsingEnabled = !isStreamResponse &&
            !(this.features & CurlFeature_1.CurlFeature.NoDataParsing) &&
            isDataStorageEnabled;
        const dataRaw = isDataStorageEnabled
            ? (0, mergeChunks_1.mergeChunks)(this.chunks, this.chunksLength)
            : Buffer.alloc(0);
        const data = isDataParsingEnabled ? decoder.write(dataRaw) : dataRaw;
        const headers = this.getHeaders();
        const { code, data: status } = this.handle.getInfo(Curl.info.RESPONSE_CODE);
        // if this had the stream response flag we need to signal the end of the stream by pushing null to it.
        if (isStreamResponse) {
            // if the writeFunctionStream is still null here, this means the response had no body
            // This may happen because the writeFunctionStream is created in the writeFunction callback, which is not called
            // for requests that do not have a body
            if (!this.writeFunctionStream) {
                // we such cases we must call the on Stream event and immediately signal the end of the stream.
                const noopStream = new stream_1.Readable({
                    read() {
                        setImmediate(() => {
                            this.push(null);
                        });
                    },
                });
                // we are calling this with nextTick because it must run before the next event loop iteration (notice that the cleanup is called with setImmediate below).
                // We are not just calling it directly to avoid errors in the on Stream callbacks causing this function to throw
                process.nextTick(() => this.emit('stream', noopStream, status, headers, this));
            }
            else {
                this.writeFunctionStream.push(null);
            }
        }
        const wrapper = isStreamResponse
            ? setImmediate
            : (fn) => fn();
        wrapper(() => {
            this.resetInternalState();
            // if is ignored because this should never happen under normal circumstances.
            /* istanbul ignore if */
            if (code !== CurlCode_1.CurlCode.CURLE_OK) {
                const error = new Error('Could not get status code of request');
                this.emit('error', error, code, this);
            }
            else {
                this.emit('end', status, data, headers, this);
            }
        });
    }
    /**
     * Enables a feature, must not be used while a request is running.
     *
     * Use {@link CurlFeature | `CurlFeature`} for predefined constants.
     */
    enable(bitmask) {
        if (this.isRunning) {
            throw new Error('You should not change the features while a request is running.');
        }
        this.features |= bitmask;
        return this;
    }
    /**
     * Disables a feature, must not be used while a request is running.
     *
     * Use {@link CurlFeature | `CurlFeature`} for predefined constants.
     */
    disable(bitmask) {
        if (this.isRunning) {
            throw new Error('You should not change the features while a request is running.');
        }
        this.features &= ~bitmask;
        return this;
    }
    /**
     * Sets an option the handle.
     *
     * This overloaded method has `never` as type for the arguments
     *  because one of the other overloaded signatures must be used.
     *
     *
     * Official libcurl documentation: [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
     *
     * @param optionIdOrName Option name or integer value. Use {@link Curl.option | `Curl.option`} for predefined constants.
     * @param optionValue The value of the option, value type depends on the option being set.
     */
    setOpt(optionIdOrName, optionValue) {
        // special case for WRITEFUNCTION and HEADERFUNCTION callbacks
        //  since if they are set back to null, we must restore the default callback.
        let value = optionValue;
        if ((optionIdOrName === Curl.option.WRITEFUNCTION ||
            optionIdOrName === 'WRITEFUNCTION') &&
            !optionValue) {
            value = this.defaultWriteFunction.bind(this);
        }
        else if ((optionIdOrName === Curl.option.HEADERFUNCTION ||
            optionIdOrName === 'HEADERFUNCTION') &&
            !optionValue) {
            value = this.defaultHeaderFunction.bind(this);
        }
        const code = this.handle.setOpt(optionIdOrName, value);
        if (code !== CurlCode_1.CurlCode.CURLE_OK) {
            throw new Error(code === CurlCode_1.CurlCode.CURLE_UNKNOWN_OPTION
                ? 'Unknown option given. First argument must be the option internal id or the option name. You can use the Curl.option constants.'
                : Easy_1.Easy.strError(code));
        }
        return this;
    }
    /**
     * Retrieves some information about the last request made by a handle.
     *
     * This overloaded method has `never` as type for the argument
     *  because one of the other overloaded signatures must be used.
     *
     * Official libcurl documentation: [`curl_easy_getinfo()`](http://curl.haxx.se/libcurl/c/curl_easy_getinfo.html)
     *
     * @param infoNameOrId Info name or integer value. Use {@link Curl.info | `Curl.info`} for predefined constants.
     */
    getInfo(infoNameOrId) {
        const { code, data } = this.handle.getInfo(infoNameOrId);
        if (code !== CurlCode_1.CurlCode.CURLE_OK) {
            throw new Error(`getInfo failed. Error: ${Easy_1.Easy.strError(code)}`);
        }
        return data;
    }
    /**
     * This will set an internal `READFUNCTION` callback that will read all the data from this stream.
     *
     * One usage for that is to upload data directly from streams. Example:
     *
     * ```typescript
     *  const curl = new Curl()
     *  curl.setOpt('URL', 'https://some-domain/upload')
     *  curl.setOpt('UPLOAD', true)
     *  // so we do not need to set the content length
     *  curl.setOpt('HTTPHEADER', ['Transfer-Encoding: chunked'])
     *
     *  const filePath = './test.zip'
     *  const stream = fs.createReadStream(filePath)
     *  curl.setUploadStream(stream)
     *
     *  curl.setStreamProgressCallback(() => {
     *    // this will use the default progress callback from libcurl
     *    return CurlProgressFunc.Continue
     *  })
     *
     *  curl.on('end', (statusCode, data) => {
     *    console.log('\n'.repeat(5))
     *    // data length should be 0, as it was sent using the response stream
     *    console.log(
     *      `curl - end - status: ${statusCode} - data length: ${data.length}`,
     *    )
     *    curl.close()
     *  })
     *  curl.on('error', (error, errorCode) => {
     *    console.log('\n'.repeat(5))
     *    console.error('curl - error: ', error, errorCode)
     *    curl.close()
     *  })
     *  curl.perform()
     * ```
     *
     * Multiple calls with the same stream that was previously set has no effect.
     *
     * Setting this to `null` will remove the `READFUNCTION` callback and disable this behavior.
     *
     * @remarks
     *
     * This option is reset after each request, so if you want to upload the same data again using the same
     * `Curl` instance, you will need to provide a new stream.
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     */
    setUploadStream(stream) {
        if (!stream) {
            if (this.readFunctionStream) {
                this.cleanupReadFunctionStreamEvents();
                this.readFunctionStream = null;
                this.setOpt('READFUNCTION', null);
            }
            return this;
        }
        if (this.readFunctionStream === stream)
            return this;
        if (typeof (stream === null || stream === void 0 ? void 0 : stream.on) !== 'function' ||
            typeof (stream === null || stream === void 0 ? void 0 : stream.read) !== 'function') {
            throw new Error('The passed value to setUploadStream does not looks like a stream object');
        }
        this.readFunctionStream = stream;
        const resumeIfPaused = () => {
            if (this.streamReadFunctionPaused) {
                this.streamReadFunctionPaused = false;
                // let's unpause only on the next event loop iteration
                // this will avoid scenarios where the readable event was emitted
                // between libcurl pausing the transfer from the READFUNCTION
                // and the next real iteration.
                setImmediate(() => {
                    // just to make sure we do not try to unpause
                    // a connection that has already finished
                    // this can happen if some error has been throw
                    // in the meantime
                    if (this.isRunning) {
                        this.pause(CurlPause_1.CurlPause.Cont);
                    }
                });
            }
        };
        const attachEventListenerToStream = (event, cb) => {
            this.readFunctionStream.on(event, cb);
            this.streamReadFunctionCallbacksToClean.push([
                this.readFunctionStream,
                event,
                cb,
            ]);
        };
        // TODO: Handle adding the event multiple times?
        // can only happen if the user calls the method with the same stream more than one time
        // and due to the if at the top, this is only possible if they use another stream in-between.
        attachEventListenerToStream('readable', () => {
            resumeIfPaused();
        });
        // This needs the same logic than the destroy callback for the response stream
        // inside the default WRITEFUNCTION.
        // Which basically means we cannot throw an error inside the READFUNCTION itself
        // as this would cause the pause itself to throw an error
        // (pause calls the READFUNCTION before returning)
        // So we must create a fake "pause" just to trigger the progress function, and
        // then the error will be thrown.
        // This is why the following two callbacks are setting
        // this.streamReadFunctionShouldPause = true
        attachEventListenerToStream('close', () => {
            // If the stream was closed, but end was not called
            // it means the stream was forcefully destroyed, so
            // we must let libcurl fail!
            // streamError could already be set if destroy was called with an error
            // as it would call the error callback below, so we don't need to do anything.
            if (!this.streamReadFunctionShouldEnd && !this.streamError) {
                this.streamError = new Error('Curl upload stream was unexpectedly destroyed');
                this.streamReadFunctionShouldPause = true;
                resumeIfPaused();
            }
        });
        attachEventListenerToStream('error', (error) => {
            this.streamError = error;
            this.streamReadFunctionShouldPause = true;
            resumeIfPaused();
        });
        attachEventListenerToStream('end', () => {
            this.streamReadFunctionShouldEnd = true;
            resumeIfPaused();
        });
        this.setOpt('READFUNCTION', (buffer, size, nmemb) => {
            // Remember, we cannot throw this.streamError here.
            if (this.streamReadFunctionShouldPause) {
                this.streamReadFunctionShouldPause = false;
                this.streamReadFunctionPaused = true;
                return CurlReadFunc_1.CurlReadFunc.Pause;
            }
            const amountToRead = size * nmemb;
            const data = stream.read(amountToRead);
            if (!data) {
                if (this.streamReadFunctionShouldEnd) {
                    return 0;
                }
                else {
                    this.streamReadFunctionPaused = true;
                    return CurlReadFunc_1.CurlReadFunc.Pause;
                }
            }
            const totalWritten = data.copy(buffer);
            // we could also return CurlReadFunc.Abort or CurlReadFunc.Pause here.
            return totalWritten;
        });
        return this;
    }
    /**
     * Set the param to `null` to use the Node.js default value.
     *
     * @param highWaterMark This will passed directly to the `Readable` stream created to be returned as the response'
     *
     * @remarks
     * Only useful when the {@link CurlFeature.StreamResponse | `StreamResponse`} feature flag is enabled.
     */
    setStreamResponseHighWaterMark(highWaterMark) {
        this.streamWriteFunctionHighWaterMark = highWaterMark || undefined;
        return this;
    }
    /**
     * This sets the callback to be used as the progress function when using any of the stream features.
     *
     * This is needed because when this `Curl` instance is enabled to use streams for upload/download, it needs
     * to set the libcurl progress function option to an internal function.
     *
     * If you are using any of the streams features, do not overwrite the progress callback to something else,
     * be it using {@link setOpt | `setOpt`} or {@link setProgressCallback | `setProgressCallback`}, as this would
     * cause undefined behavior.
     *
     * If are using this callback, there is no need to set the `NOPROGRESS` option to false (as you normally would).
     */
    setStreamProgressCallback(cb) {
        this.streamUserSuppliedProgressFunction = cb;
        return this;
    }
    /**
     * The option `XFERINFOFUNCTION` was introduced in curl version `7.32.0`,
     *  versions older than that should use `PROGRESSFUNCTION`.
     * If you don't want to mess with version numbers you can use this method,
     * instead of directly calling {@link Curl.setOpt | `Curl#setOpt`}.
     *
     * `NOPROGRESS` should be set to false to make this function actually get called.
     */
    setProgressCallback(cb) {
        if (Curl.VERSION_NUM >= 0x072000) {
            this.handle.setOpt(Curl.option.XFERINFOFUNCTION, cb);
        }
        else {
            this.handle.setOpt(Curl.option.PROGRESSFUNCTION, cb);
        }
        return this;
    }
    /**
     * Add this instance to the processing queue.
     * This method should be called only one time per request,
     *  otherwise it will throw an error.
     *
     * @remarks
     *
     * This basically calls the {@link "Multi".Multi.addHandle | `Multi#addHandle`} method.
     */
    perform() {
        if (this.isRunning) {
            throw new Error('Handle already running!');
        }
        this.isRunning = true;
        // set progress function to our internal one if using stream upload/download
        const isStreamEnabled = this.features & CurlFeature_1.CurlFeature.StreamResponse || this.readFunctionStream;
        if (isStreamEnabled) {
            this.setProgressCallback(this.streamModeProgressFunction.bind(this));
            this.setOpt('NOPROGRESS', false);
        }
        return this;
    }
    /**
     * Perform any connection upkeep checks.
     *
     *
     * Official libcurl documentation: [`curl_easy_upkeep()`](http://curl.haxx.se/libcurl/c/curl_easy_upkeep.html)
     */
    upkeep() {
        const code = this.handle.upkeep();
        if (code !== CurlCode_1.CurlCode.CURLE_OK) {
            throw new Error(Easy_1.Easy.strError(code));
        }
        return this;
    }
    /**
     * Use this function to pause / unpause a connection.
     *
     * The bitmask argument is a set of bits that sets the new state of the connection.
     *
     * Use {@link CurlPause | `CurlPause`} for predefined constants.
     *
     *
     * Official libcurl documentation: [`curl_easy_pause()`](http://curl.haxx.se/libcurl/c/curl_easy_pause.html)
     */
    pause(bitmask) {
        const code = this.handle.pause(bitmask);
        if (code !== CurlCode_1.CurlCode.CURLE_OK) {
            throw new Error(Easy_1.Easy.strError(code));
        }
        return this;
    }
    /**
     * Reset this handle options to their defaults.
     *
     * This will put the handle in a clean state, as if it was just created.
     *
     *
     * Official libcurl documentation: [`curl_easy_reset()`](http://curl.haxx.se/libcurl/c/curl_easy_reset.html)
     */
    reset() {
        this.removeAllListeners();
        this.handle.reset();
        // add callbacks back as reset will remove them
        this.handle.setOpt(Curl.option.WRITEFUNCTION, this.defaultWriteFunction.bind(this));
        this.handle.setOpt(Curl.option.HEADERFUNCTION, this.defaultHeaderFunction.bind(this));
        return this;
    }
    /**
     * Duplicate this handle with all their options.
     * Keep in mind that, by default, this also means all event listeners.
     *
     *
     * Official libcurl documentation: [`curl_easy_duphandle()`](http://curl.haxx.se/libcurl/c/curl_easy_duphandle.html)
     *
     * @param shouldCopyEventListeners If you don't want to copy the event listeners, set this to `false`.
     */
    dupHandle(shouldCopyEventListeners = true) {
        const duplicatedHandle = new Curl(this.handle.dupHandle());
        const eventsToCopy = ['end', 'error', 'data', 'header'];
        duplicatedHandle.features = this.features;
        if (shouldCopyEventListeners) {
            for (let i = 0; i < eventsToCopy.length; i += 1) {
                const listeners = this.listeners(eventsToCopy[i]);
                for (let j = 0; j < listeners.length; j += 1) {
                    duplicatedHandle.on(eventsToCopy[i], listeners[j]);
                }
            }
        }
        return duplicatedHandle;
    }
    /**
     * Close this handle.
     *
     * **NOTE:** After closing the handle, it must not be used anymore. Doing so will throw an error.
     *
     *
     * Official libcurl documentation: [`curl_easy_cleanup()`](http://curl.haxx.se/libcurl/c/curl_easy_cleanup.html)
     */
    close() {
        // TODO(jonathan): on next semver major check if this.handle.isOpen is false and if it is, return immediately.
        curlInstanceMap.delete(this.handle);
        this.removeAllListeners();
        this.handle.setOpt(Curl.option.WRITEFUNCTION, null);
        this.handle.setOpt(Curl.option.HEADERFUNCTION, null);
        this.handle.close();
    }
    /**
     * This is used to reset a few properties to their pre-request state.
     */
    resetInternalState() {
        this.isRunning = false;
        this.chunks = [];
        this.chunksLength = 0;
        this.headerChunks = [];
        this.headerChunksLength = 0;
        const wasStreamEnabled = this.writeFunctionStream || this.readFunctionStream;
        if (wasStreamEnabled) {
            this.setProgressCallback(null);
        }
        // reset back the READFUNCTION if there was a stream we were reading from
        if (this.readFunctionStream) {
            this.setOpt('READFUNCTION', null);
        }
        // these are mostly streams related, as these options are not persisted between requests
        // the streams themselves
        this.writeFunctionStream = null;
        this.readFunctionStream = null;
        // READFUNCTION / upload related
        this.streamReadFunctionShouldEnd = false;
        this.streamReadFunctionShouldPause = false;
        this.streamReadFunctionPaused = false;
        // WRITEFUNCTION / download related
        this.streamWriteFunctionShouldPause = false;
        this.streamWriteFunctionPaused = false;
        this.streamWriteFunctionFirstRun = true;
        // common
        this.streamPauseNext = false;
        this.streamContinueNext = false;
        this.streamError = false;
        this.streamUserSuppliedProgressFunction = null;
        this.cleanupReadFunctionStreamEvents();
    }
    /**
     * When uploading a stream (by calling {@link setUploadStream | `setUploadStream`})
     * some event listeners are attached to the stream instance.
     * This will remove them so our callbacks are not called anymore.
     */
    cleanupReadFunctionStreamEvents() {
        this.streamReadFunctionCallbacksToClean.forEach(([stream, event, cb]) => {
            stream.off(event, cb);
        });
        this.streamReadFunctionCallbacksToClean = [];
    }
    /**
     * Returns headers from the current stored chunks - if any
     */
    getHeaders() {
        const isHeaderStorageEnabled = !(this.features & CurlFeature_1.CurlFeature.NoHeaderStorage);
        const isHeaderParsingEnabled = !(this.features & CurlFeature_1.CurlFeature.NoHeaderParsing) && isHeaderStorageEnabled;
        const headersRaw = isHeaderStorageEnabled
            ? (0, mergeChunks_1.mergeChunks)(this.headerChunks, this.headerChunksLength)
            : Buffer.alloc(0);
        return isHeaderParsingEnabled
            ? (0, parseHeaders_1.parseHeaders)(decoder.write(headersRaw))
            : headersRaw;
    }
    /**
     * The internal function passed to `PROGRESSFUNCTION` (`XFERINFOFUNCTION` on most recent libcurl versions)
     * when using any of the stream features.
     */
    streamModeProgressFunction(dltotal, dlnow, ultotal, ulnow) {
        if (this.streamError)
            throw this.streamError;
        const ret = this.streamUserSuppliedProgressFunction
            ? this.streamUserSuppliedProgressFunction.call(this.handle, dltotal, dlnow, ultotal, ulnow)
            : 0;
        return ret;
    }
    /**
     * This is the default callback passed to {@link setOpt | `setOpt('WRITEFUNCTION', cb)`}.
     */
    defaultWriteFunction(chunk, size, nmemb) {
        // this is a stream based request, so we need a totally different handling
        if (this.features & CurlFeature_1.CurlFeature.StreamResponse) {
            return this.defaultWriteFunctionStreamBased(chunk, size, nmemb);
        }
        if (!(this.features & CurlFeature_1.CurlFeature.NoDataStorage)) {
            this.chunks.push(chunk);
            this.chunksLength += chunk.length;
        }
        this.emit('data', chunk, this);
        return size * nmemb;
    }
    /**
     * This is used by the default callback passed to {@link setOpt | `setOpt('WRITEFUNCTION', cb)`}
     * when the feature to stream response is enabled.
     */
    defaultWriteFunctionStreamBased(chunk, size, nmemb) {
        if (!this.writeFunctionStream) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const handle = this;
            // create the response stream we are going to use
            this.writeFunctionStream = new stream_1.Readable({
                highWaterMark: this.streamWriteFunctionHighWaterMark,
                destroy(error, cb) {
                    handle.streamError =
                        error ||
                            new Error('Curl response stream was unexpectedly destroyed');
                    // let the event loop run one more time before we do anything
                    // if the handle is not running anymore it means that the
                    // error we set above was caught, if it is still running, then it means that:
                    // - the handle is paused
                    // - the progress function was not called yet
                    // If this is the case, then we just unpause the handle. This will cause the following:
                    // - the WRITEFUNCTION callback will be called
                    // - this will pause the handle again (because we cannot throw the error in here)
                    // - the PROGRESSFUNCTION callback will be called, and then the error will be thrown.
                    setImmediate(() => {
                        if (handle.isRunning && handle.streamWriteFunctionPaused) {
                            handle.streamWriteFunctionPaused = false;
                            handle.streamWriteFunctionShouldPause = true;
                            try {
                                handle.pause(CurlPause_1.CurlPause.RecvCont);
                            }
                            catch (error) {
                                cb(error);
                                return;
                            }
                        }
                        cb(null);
                    });
                },
                read(_size) {
                    if (handle.streamWriteFunctionFirstRun ||
                        handle.streamWriteFunctionPaused) {
                        if (handle.streamWriteFunctionFirstRun) {
                            handle.streamWriteFunctionFirstRun = false;
                        }
                        // we must allow Node.js to process the whole event queue
                        // before we unpause
                        setImmediate(() => {
                            if (handle.isRunning) {
                                handle.streamWriteFunctionPaused = false;
                                handle.pause(CurlPause_1.CurlPause.RecvCont);
                            }
                        });
                    }
                },
            });
            // as soon as we have the stream, we need to emit the "stream" event
            // but the "stream" event needs the statusCode and the headers, so this
            // is what we are retrieving here.
            const headers = this.getHeaders();
            const { code, data: status } = this.handle.getInfo(Curl.info.RESPONSE_CODE);
            if (code !== CurlCode_1.CurlCode.CURLE_OK) {
                const error = new Error('Could not get status code of request');
                this.emit('error', error, code, this);
                return 0;
            }
            // let's emit the event only in the next iteration of the event loop
            // We need to do this otherwise the event listener callbacks would run
            // before the pause below, and this is probably not what we want.
            setImmediate(() => this.emit('stream', this.writeFunctionStream, status, headers, this));
            this.streamWriteFunctionPaused = true;
            return CurlWriteFunc_1.CurlWriteFunc.Pause;
        }
        // pause this req
        if (this.streamWriteFunctionShouldPause) {
            this.streamWriteFunctionShouldPause = false;
            this.streamWriteFunctionPaused = true;
            return CurlWriteFunc_1.CurlWriteFunc.Pause;
        }
        // write to the stream
        const ok = this.writeFunctionStream.push(chunk);
        // pause connection until there is more data
        if (!ok) {
            this.streamWriteFunctionPaused = true;
            this.pause(CurlPause_1.CurlPause.Recv);
        }
        return size * nmemb;
    }
    /**
     * This is the default callback passed to {@link setOpt | `setOpt('HEADERFUNCTION', cb)`}.
     */
    defaultHeaderFunction(chunk, size, nmemb) {
        if (!(this.features & CurlFeature_1.CurlFeature.NoHeaderStorage)) {
            this.headerChunks.push(chunk);
            this.headerChunksLength += chunk.length;
        }
        this.emit('header', chunk, this);
        return size * nmemb;
    }
}
exports.Curl = Curl;
/**
 * Calls [`curl_global_init()`](http://curl.haxx.se/libcurl/c/curl_global_init.html).
 *
 * For **flags** see the the enum {@link CurlGlobalInit | `CurlGlobalInit`}.
 *
 * This is automatically called when the addon is loaded, to disable this, set the environment variable
 *  `NODE_LIBCURL_DISABLE_GLOBAL_INIT_CALL=false`
 */
Curl.globalInit = _Curl.globalInit;
/**
 * Calls [`curl_global_cleanup()`](http://curl.haxx.se/libcurl/c/curl_global_cleanup.html)
 *
 * This is automatically called when the process is exiting.
 */
Curl.globalCleanup = _Curl.globalCleanup;
/**
 * Returns libcurl version string.
 *
 * The string shows which libraries libcurl was built with and their versions, example:
 * ```
 * libcurl/7.69.1-DEV OpenSSL/1.1.1d zlib/1.2.11 WinIDN libssh2/1.9.0_DEV nghttp2/1.40.0
 * ```
 */
Curl.getVersion = _Curl.getVersion;
/**
 * This is the default user agent that is going to be used on all `Curl` instances.
 *
 * You can overwrite this in a per instance basis, calling `curlHandle.setOpt('USERAGENT', 'my-user-agent/1.0')`, or
 *  by directly changing this property so it affects all newly created `Curl` instances.
 *
 * To disable this behavior set this property to `null`.
 */
Curl.defaultUserAgent = `node-libcurl/${pkg.version}`;
/**
 * Integer representing the current libcurl version.
 *
 * It was built the following way:
 * ```
 * <8 bits major number> | <8 bits minor number> | <8 bits patch number>.
 * ```
 * Version `7.69.1` is therefore returned as `0x074501` / `476417`
 */
Curl.VERSION_NUM = _Curl.VERSION_NUM;
/**
 * This is a object with members resembling the `CURLINFO_*` libcurl constants.
 *
 * It can be used with {@link "Easy".Easy.getInfo | `Easy#getInfo`} or {@link getInfo | `Curl#getInfo`}.
 *
 * See the official documentation of [`curl_easy_getinfo()`](http://curl.haxx.se/libcurl/c/curl_easy_getinfo.html)
 *  for reference.
 *
 * `CURLINFO_EFFECTIVE_URL` becomes `Curl.info.EFFECTIVE_URL`
 */
Curl.info = _Curl.info;
/**
 * This is a object with members resembling the `CURLOPT_*` libcurl constants.
 *
 * It can be used with {@link "Easy".Easy.setOpt | `Easy#setOpt`} or {@link setOpt | `Curl#setOpt`}.
 *
 * See the official documentation of [`curl_easy_setopt()`](http://curl.haxx.se/libcurl/c/curl_easy_setopt.html)
 *  for reference.
 *
 * `CURLOPT_URL` becomes `Curl.option.URL`
 */
Curl.option = _Curl.option;
/**
 * Returns an object with a representation of the current libcurl version and their features/protocols.
 *
 * This is basically [`curl_version_info()`](https://curl.haxx.se/libcurl/c/curl_version_info.html)
 */
Curl.getVersionInfo = () => CurlVersionInfo;
/**
 * Returns a string that looks like the one returned by
 * ```bash
 * curl -V
 * ```
 * Example:
 * ```
 * Version: libcurl/7.69.1-DEV OpenSSL/1.1.1d zlib/1.2.11 WinIDN libssh2/1.9.0_DEV nghttp2/1.40.0
 * Protocols: dict, file, ftp, ftps, gopher, http, https, imap, imaps, ldap, ldaps, pop3, pop3s, rtsp, scp, sftp, smb, smbs, smtp, smtps, telnet, tftp
 * Features: AsynchDNS, IDN, IPv6, Largefile, SSPI, Kerberos, SPNEGO, NTLM, SSL, libz, HTTP2, HTTPS-proxy
 * ```
 */
Curl.getVersionInfoString = () => {
    const version = Curl.getVersion();
    const protocols = CurlVersionInfo.protocols.join(', ');
    const features = CurlVersionInfo.features.join(', ');
    return [
        `Version: ${version}`,
        `Protocols: ${protocols}`,
        `Features: ${features}`,
    ].join('\n');
};
/**
 * Useful if you want to check if the current libcurl version is greater or equal than another one.
 * @param x major
 * @param y minor
 * @param z patch
 */
Curl.isVersionGreaterOrEqualThan = (x, y, z = 0) => {
    return _Curl.VERSION_NUM >= (x << 16) + (y << 8) + z;
};
//# sourceMappingURL=Curl.js.map

/***/ }),

/***/ 1517:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Easy = void 0;
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bindings = __nccwpck_require__(720);
/**
 * This is a Node.js wrapper around the binding {@link EasyNativeBinding | native Easy class}
 *
 * @public
 */
class Easy extends bindings.Easy {
}
exports.Easy = Easy;
//# sourceMappingURL=Easy.js.map

/***/ }),

/***/ 3625:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlShareCode = exports.CurlCode = exports.CurlMultiCode = void 0;
// https://github.com/curl/curl/blob/7e35eb7729/include/curl/multi.h#L61
/**
 * @public
 */
var CurlMultiCode;
(function (CurlMultiCode) {
    CurlMultiCode[CurlMultiCode["CURLM_CALL_MULTI_PERFORM"] = -1] = "CURLM_CALL_MULTI_PERFORM"; /* please call curl_multi_perform() or
    curl_multi_socket*() soon */
    CurlMultiCode[CurlMultiCode["CURLM_OK"] = 0] = "CURLM_OK";
    CurlMultiCode[CurlMultiCode["CURLM_BAD_HANDLE"] = 1] = "CURLM_BAD_HANDLE"; /* the passed-in handle is not a valid CURLM handle */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_EASY_HANDLE"] = 2] = "CURLM_BAD_EASY_HANDLE"; /* an easy handle was not good/valid */
    CurlMultiCode[CurlMultiCode["CURLM_OUT_OF_MEMORY"] = 3] = "CURLM_OUT_OF_MEMORY"; /* if you ever get this, you're in deep sh*t */
    CurlMultiCode[CurlMultiCode["CURLM_INTERNAL_ERROR"] = 4] = "CURLM_INTERNAL_ERROR"; /* this is a libcurl bug */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_SOCKET"] = 5] = "CURLM_BAD_SOCKET"; /* the passed in socket argument did not match */
    CurlMultiCode[CurlMultiCode["CURLM_UNKNOWN_OPTION"] = 6] = "CURLM_UNKNOWN_OPTION"; /* curl_multi_setopt() with unsupported option */
    CurlMultiCode[CurlMultiCode["CURLM_ADDED_ALREADY"] = 7] = "CURLM_ADDED_ALREADY"; /* an easy handle already added to a multi handle was
    attempted to get added - again */
    CurlMultiCode[CurlMultiCode["CURLM_RECURSIVE_API_CALL"] = 8] = "CURLM_RECURSIVE_API_CALL"; /* an api function was called from inside a
    callback */
    CurlMultiCode[CurlMultiCode["CURLM_WAKEUP_FAILURE"] = 9] = "CURLM_WAKEUP_FAILURE"; /* wakeup is unavailable or failed */
    CurlMultiCode[CurlMultiCode["CURLM_BAD_FUNCTION_ARGUMENT"] = 10] = "CURLM_BAD_FUNCTION_ARGUMENT"; /* function called with a bad parameter */
    CurlMultiCode[CurlMultiCode["CURLM_LAST"] = 11] = "CURLM_LAST";
    /* just to make code nicer when using curl_multi_socket() you can now check
       for CURLM_CALL_MULTI_SOCKET too in the same style it works for
       curl_multi_perform() and CURLM_CALL_MULTI_PERFORM */
    CurlMultiCode[CurlMultiCode["CURLM_CALL_MULTI_SOCKET"] = -1] = "CURLM_CALL_MULTI_SOCKET";
})(CurlMultiCode || (exports.CurlMultiCode = CurlMultiCode = {}));
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L478
/**
 * @public
 */
var CurlCode;
(function (CurlCode) {
    CurlCode[CurlCode["CURLE_OK"] = 0] = "CURLE_OK";
    CurlCode[CurlCode["CURLE_UNSUPPORTED_PROTOCOL"] = 1] = "CURLE_UNSUPPORTED_PROTOCOL"; /* 1 */
    CurlCode[CurlCode["CURLE_FAILED_INIT"] = 2] = "CURLE_FAILED_INIT"; /* 2 */
    CurlCode[CurlCode["CURLE_URL_MALFORMAT"] = 3] = "CURLE_URL_MALFORMAT"; /* 3 */
    CurlCode[CurlCode["CURLE_NOT_BUILT_IN"] = 4] = "CURLE_NOT_BUILT_IN"; /* 4 - [was obsoleted in August 2007 for
                                      7.17.0, reused in April 2011 for 7.21.5] */
    CurlCode[CurlCode["CURLE_COULDNT_RESOLVE_PROXY"] = 5] = "CURLE_COULDNT_RESOLVE_PROXY"; /* 5 */
    CurlCode[CurlCode["CURLE_COULDNT_RESOLVE_HOST"] = 6] = "CURLE_COULDNT_RESOLVE_HOST"; /* 6 */
    CurlCode[CurlCode["CURLE_COULDNT_CONNECT"] = 7] = "CURLE_COULDNT_CONNECT"; /* 7 */
    CurlCode[CurlCode["CURLE_WEIRD_SERVER_REPLY"] = 8] = "CURLE_WEIRD_SERVER_REPLY"; /* 8 */
    CurlCode[CurlCode["CURLE_REMOTE_ACCESS_DENIED"] = 9] = "CURLE_REMOTE_ACCESS_DENIED"; /* 9 a service was denied by the server
                                      due to lack of access - when login fails
                                      this is not returned. */
    CurlCode[CurlCode["CURLE_FTP_ACCEPT_FAILED"] = 10] = "CURLE_FTP_ACCEPT_FAILED"; /* 10 - [was obsoleted in April 2006 for
                                      7.15.4, reused in Dec 2011 for 7.24.0]*/
    CurlCode[CurlCode["CURLE_FTP_WEIRD_PASS_REPLY"] = 11] = "CURLE_FTP_WEIRD_PASS_REPLY"; /* 11 */
    CurlCode[CurlCode["CURLE_FTP_ACCEPT_TIMEOUT"] = 12] = "CURLE_FTP_ACCEPT_TIMEOUT"; /* 12 - timeout occurred accepting server
                                      [was obsoleted in August 2007 for 7.17.0,
                                      reused in Dec 2011 for 7.24.0]*/
    CurlCode[CurlCode["CURLE_FTP_WEIRD_PASV_REPLY"] = 13] = "CURLE_FTP_WEIRD_PASV_REPLY"; /* 13 */
    CurlCode[CurlCode["CURLE_FTP_WEIRD_227_FORMAT"] = 14] = "CURLE_FTP_WEIRD_227_FORMAT"; /* 14 */
    CurlCode[CurlCode["CURLE_FTP_CANT_GET_HOST"] = 15] = "CURLE_FTP_CANT_GET_HOST"; /* 15 */
    CurlCode[CurlCode["CURLE_HTTP2"] = 16] = "CURLE_HTTP2"; /* 16 - A problem in the http2 framing layer.
                                      [was obsoleted in August 2007 for 7.17.0,
                                      reused in July 2014 for 7.38.0] */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_SET_TYPE"] = 17] = "CURLE_FTP_COULDNT_SET_TYPE"; /* 17 */
    CurlCode[CurlCode["CURLE_PARTIAL_FILE"] = 18] = "CURLE_PARTIAL_FILE"; /* 18 */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_RETR_FILE"] = 19] = "CURLE_FTP_COULDNT_RETR_FILE"; /* 19 */
    CurlCode[CurlCode["CURLE_OBSOLETE20"] = 20] = "CURLE_OBSOLETE20"; /* 20 - NOT USED */
    CurlCode[CurlCode["CURLE_QUOTE_ERROR"] = 21] = "CURLE_QUOTE_ERROR"; /* 21 - quote command failure */
    CurlCode[CurlCode["CURLE_HTTP_RETURNED_ERROR"] = 22] = "CURLE_HTTP_RETURNED_ERROR"; /* 22 */
    CurlCode[CurlCode["CURLE_WRITE_ERROR"] = 23] = "CURLE_WRITE_ERROR"; /* 23 */
    CurlCode[CurlCode["CURLE_OBSOLETE24"] = 24] = "CURLE_OBSOLETE24"; /* 24 - NOT USED */
    CurlCode[CurlCode["CURLE_UPLOAD_FAILED"] = 25] = "CURLE_UPLOAD_FAILED"; /* 25 - failed upload "command" */
    CurlCode[CurlCode["CURLE_READ_ERROR"] = 26] = "CURLE_READ_ERROR"; /* 26 - couldn't open/read from file */
    CurlCode[CurlCode["CURLE_OUT_OF_MEMORY"] = 27] = "CURLE_OUT_OF_MEMORY"; /* 27 */
    /* Note: CURLE_OUT_OF_MEMORY may sometimes indicate a conversion error
             instead of a memory allocation error if CURL_DOES_CONVERSIONS
             is defined
    */
    CurlCode[CurlCode["CURLE_OPERATION_TIMEDOUT"] = 28] = "CURLE_OPERATION_TIMEDOUT"; /* 28 - the timeout time was reached */
    CurlCode[CurlCode["CURLE_OBSOLETE29"] = 29] = "CURLE_OBSOLETE29"; /* 29 - NOT USED */
    CurlCode[CurlCode["CURLE_FTP_PORT_FAILED"] = 30] = "CURLE_FTP_PORT_FAILED"; /* 30 - FTP PORT operation failed */
    CurlCode[CurlCode["CURLE_FTP_COULDNT_USE_REST"] = 31] = "CURLE_FTP_COULDNT_USE_REST"; /* 31 - the REST command failed */
    CurlCode[CurlCode["CURLE_OBSOLETE32"] = 32] = "CURLE_OBSOLETE32"; /* 32 - NOT USED */
    CurlCode[CurlCode["CURLE_RANGE_ERROR"] = 33] = "CURLE_RANGE_ERROR"; /* 33 - RANGE "command" didn't work */
    CurlCode[CurlCode["CURLE_HTTP_POST_ERROR"] = 34] = "CURLE_HTTP_POST_ERROR"; /* 34 */
    CurlCode[CurlCode["CURLE_SSL_CONNECT_ERROR"] = 35] = "CURLE_SSL_CONNECT_ERROR"; /* 35 - wrong when connecting with SSL */
    CurlCode[CurlCode["CURLE_BAD_DOWNLOAD_RESUME"] = 36] = "CURLE_BAD_DOWNLOAD_RESUME"; /* 36 - couldn't resume download */
    CurlCode[CurlCode["CURLE_FILE_COULDNT_READ_FILE"] = 37] = "CURLE_FILE_COULDNT_READ_FILE"; /* 37 */
    CurlCode[CurlCode["CURLE_LDAP_CANNOT_BIND"] = 38] = "CURLE_LDAP_CANNOT_BIND"; /* 38 */
    CurlCode[CurlCode["CURLE_LDAP_SEARCH_FAILED"] = 39] = "CURLE_LDAP_SEARCH_FAILED"; /* 39 */
    CurlCode[CurlCode["CURLE_OBSOLETE40"] = 40] = "CURLE_OBSOLETE40"; /* 40 - NOT USED */
    CurlCode[CurlCode["CURLE_FUNCTION_NOT_FOUND"] = 41] = "CURLE_FUNCTION_NOT_FOUND"; /* 41 - NOT USED starting with 7.53.0 */
    CurlCode[CurlCode["CURLE_ABORTED_BY_CALLBACK"] = 42] = "CURLE_ABORTED_BY_CALLBACK"; /* 42 */
    CurlCode[CurlCode["CURLE_BAD_FUNCTION_ARGUMENT"] = 43] = "CURLE_BAD_FUNCTION_ARGUMENT"; /* 43 */
    CurlCode[CurlCode["CURLE_OBSOLETE44"] = 44] = "CURLE_OBSOLETE44"; /* 44 - NOT USED */
    CurlCode[CurlCode["CURLE_INTERFACE_FAILED"] = 45] = "CURLE_INTERFACE_FAILED"; /* 45 - CURLOPT_INTERFACE failed */
    CurlCode[CurlCode["CURLE_OBSOLETE46"] = 46] = "CURLE_OBSOLETE46"; /* 46 - NOT USED */
    CurlCode[CurlCode["CURLE_TOO_MANY_REDIRECTS"] = 47] = "CURLE_TOO_MANY_REDIRECTS"; /* 47 - catch endless re-direct loops */
    CurlCode[CurlCode["CURLE_UNKNOWN_OPTION"] = 48] = "CURLE_UNKNOWN_OPTION"; /* 48 - User specified an unknown option */
    CurlCode[CurlCode["CURLE_SETOPT_OPTION_SYNTAX"] = 49] = "CURLE_SETOPT_OPTION_SYNTAX"; /* 49 - Malformed telnet option */
    CurlCode[CurlCode["CURLE_OBSOLETE50"] = 50] = "CURLE_OBSOLETE50"; /* 50 - NOT USED */
    CurlCode[CurlCode["CURLE_OBSOLETE51"] = 51] = "CURLE_OBSOLETE51"; /* 51 - NOT USED */
    CurlCode[CurlCode["CURLE_GOT_NOTHING"] = 52] = "CURLE_GOT_NOTHING"; /* 52 - when this is a specific error */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_NOTFOUND"] = 53] = "CURLE_SSL_ENGINE_NOTFOUND"; /* 53 - SSL crypto engine not found */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_SETFAILED"] = 54] = "CURLE_SSL_ENGINE_SETFAILED"; /* 54 - can not set SSL crypto engine as
                                      default */
    CurlCode[CurlCode["CURLE_SEND_ERROR"] = 55] = "CURLE_SEND_ERROR"; /* 55 - failed sending network data */
    CurlCode[CurlCode["CURLE_RECV_ERROR"] = 56] = "CURLE_RECV_ERROR"; /* 56 - failure in receiving network data */
    CurlCode[CurlCode["CURLE_OBSOLETE57"] = 57] = "CURLE_OBSOLETE57"; /* 57 - NOT IN USE */
    CurlCode[CurlCode["CURLE_SSL_CERTPROBLEM"] = 58] = "CURLE_SSL_CERTPROBLEM"; /* 58 - problem with the local certificate */
    CurlCode[CurlCode["CURLE_SSL_CIPHER"] = 59] = "CURLE_SSL_CIPHER"; /* 59 - couldn't use specified cipher */
    CurlCode[CurlCode["CURLE_PEER_FAILED_VERIFICATION"] = 60] = "CURLE_PEER_FAILED_VERIFICATION"; /* 60 - peer's certificate or fingerprint
                                       wasn't verified fine */
    CurlCode[CurlCode["CURLE_BAD_CONTENT_ENCODING"] = 61] = "CURLE_BAD_CONTENT_ENCODING"; /* 61 - Unrecognized/bad encoding */
    CurlCode[CurlCode["CURLE_LDAP_INVALID_URL"] = 62] = "CURLE_LDAP_INVALID_URL"; /* 62 - Invalid LDAP URL */
    CurlCode[CurlCode["CURLE_FILESIZE_EXCEEDED"] = 63] = "CURLE_FILESIZE_EXCEEDED"; /* 63 - Maximum file size exceeded */
    CurlCode[CurlCode["CURLE_USE_SSL_FAILED"] = 64] = "CURLE_USE_SSL_FAILED"; /* 64 - Requested FTP SSL level failed */
    CurlCode[CurlCode["CURLE_SEND_FAIL_REWIND"] = 65] = "CURLE_SEND_FAIL_REWIND"; /* 65 - Sending the data requires a rewind
                                      that failed */
    CurlCode[CurlCode["CURLE_SSL_ENGINE_INITFAILED"] = 66] = "CURLE_SSL_ENGINE_INITFAILED"; /* 66 - failed to initialise ENGINE */
    CurlCode[CurlCode["CURLE_LOGIN_DENIED"] = 67] = "CURLE_LOGIN_DENIED"; /* 67 - user, password or similar was not
                                      accepted and we failed to login */
    CurlCode[CurlCode["CURLE_TFTP_NOTFOUND"] = 68] = "CURLE_TFTP_NOTFOUND"; /* 68 - file not found on server */
    CurlCode[CurlCode["CURLE_TFTP_PERM"] = 69] = "CURLE_TFTP_PERM"; /* 69 - permission problem on server */
    CurlCode[CurlCode["CURLE_REMOTE_DISK_FULL"] = 70] = "CURLE_REMOTE_DISK_FULL"; /* 70 - out of disk space on server */
    CurlCode[CurlCode["CURLE_TFTP_ILLEGAL"] = 71] = "CURLE_TFTP_ILLEGAL"; /* 71 - Illegal TFTP operation */
    CurlCode[CurlCode["CURLE_TFTP_UNKNOWNID"] = 72] = "CURLE_TFTP_UNKNOWNID"; /* 72 - Unknown transfer ID */
    CurlCode[CurlCode["CURLE_REMOTE_FILE_EXISTS"] = 73] = "CURLE_REMOTE_FILE_EXISTS"; /* 73 - File already exists */
    CurlCode[CurlCode["CURLE_TFTP_NOSUCHUSER"] = 74] = "CURLE_TFTP_NOSUCHUSER"; /* 74 - No such user */
    CurlCode[CurlCode["CURLE_CONV_FAILED"] = 75] = "CURLE_CONV_FAILED"; /* 75 - conversion failed */
    CurlCode[CurlCode["CURLE_CONV_REQD"] = 76] = "CURLE_CONV_REQD"; /* 76 - caller must register conversion
                                      callbacks using curl_easy_setopt options
                                      CURLOPT_CONV_FROM_NETWORK_FUNCTION,
                                      CURLOPT_CONV_TO_NETWORK_FUNCTION, and
                                      CURLOPT_CONV_FROM_UTF8_FUNCTION */
    CurlCode[CurlCode["CURLE_SSL_CACERT_BADFILE"] = 77] = "CURLE_SSL_CACERT_BADFILE"; /* 77 - could not load CACERT file, missing
                                      or wrong format */
    CurlCode[CurlCode["CURLE_REMOTE_FILE_NOT_FOUND"] = 78] = "CURLE_REMOTE_FILE_NOT_FOUND"; /* 78 - remote file not found */
    CurlCode[CurlCode["CURLE_SSH"] = 79] = "CURLE_SSH"; /* 79 - error from the SSH layer, somewhat
                                      generic so the error message will be of
                                      interest when this has happened */
    CurlCode[CurlCode["CURLE_SSL_SHUTDOWN_FAILED"] = 80] = "CURLE_SSL_SHUTDOWN_FAILED"; /* 80 - Failed to shut down the SSL
                                      connection */
    CurlCode[CurlCode["CURLE_AGAIN"] = 81] = "CURLE_AGAIN"; /* 81 - socket is not ready for send/recv,
                                      wait till it's ready and try again (Added
                                      in 7.18.2) */
    CurlCode[CurlCode["CURLE_SSL_CRL_BADFILE"] = 82] = "CURLE_SSL_CRL_BADFILE"; /* 82 - could not load CRL file, missing or
                                      wrong format (Added in 7.19.0) */
    CurlCode[CurlCode["CURLE_SSL_ISSUER_ERROR"] = 83] = "CURLE_SSL_ISSUER_ERROR"; /* 83 - Issuer check failed.  (Added in
                                      7.19.0) */
    CurlCode[CurlCode["CURLE_FTP_PRET_FAILED"] = 84] = "CURLE_FTP_PRET_FAILED"; /* 84 - a PRET command failed */
    CurlCode[CurlCode["CURLE_RTSP_CSEQ_ERROR"] = 85] = "CURLE_RTSP_CSEQ_ERROR"; /* 85 - mismatch of RTSP CSeq numbers */
    CurlCode[CurlCode["CURLE_RTSP_SESSION_ERROR"] = 86] = "CURLE_RTSP_SESSION_ERROR"; /* 86 - mismatch of RTSP Session Ids */
    CurlCode[CurlCode["CURLE_FTP_BAD_FILE_LIST"] = 87] = "CURLE_FTP_BAD_FILE_LIST"; /* 87 - unable to parse FTP file list */
    CurlCode[CurlCode["CURLE_CHUNK_FAILED"] = 88] = "CURLE_CHUNK_FAILED"; /* 88 - chunk callback reported error */
    CurlCode[CurlCode["CURLE_NO_CONNECTION_AVAILABLE"] = 89] = "CURLE_NO_CONNECTION_AVAILABLE"; /* 89 - No connection available, the
                                      session will be queued */
    CurlCode[CurlCode["CURLE_SSL_PINNEDPUBKEYNOTMATCH"] = 90] = "CURLE_SSL_PINNEDPUBKEYNOTMATCH"; /* 90 - specified pinned public key did not
                                       match */
    CurlCode[CurlCode["CURLE_SSL_INVALIDCERTSTATUS"] = 91] = "CURLE_SSL_INVALIDCERTSTATUS"; /* 91 - invalid certificate status */
    CurlCode[CurlCode["CURLE_HTTP2_STREAM"] = 92] = "CURLE_HTTP2_STREAM"; /* 92 - stream error in HTTP/2 framing layer */
    CurlCode[CurlCode["CURLE_RECURSIVE_API_CALL"] = 93] = "CURLE_RECURSIVE_API_CALL"; /* 93 - an api function was called from inside a callback */
    CurlCode[CurlCode["CURLE_AUTH_ERROR"] = 94] = "CURLE_AUTH_ERROR"; /* 94 - an authentication function returned an error */
    CurlCode[CurlCode["CURLE_HTTP3"] = 95] = "CURLE_HTTP3"; /* 95 - An HTTP/3 layer problem */
    CurlCode[CurlCode["CURLE_QUIC_CONNECT_ERROR"] = 96] = "CURLE_QUIC_CONNECT_ERROR"; /* 96 - QUIC connection error */
    CurlCode[CurlCode["CURLE_PROXY"] = 97] = "CURLE_PROXY"; /* 97 - proxy handshake error */
    CurlCode[CurlCode["CURLE_SSL_CLIENTCERT"] = 98] = "CURLE_SSL_CLIENTCERT"; /* 98 - client-side certificate required */
    CurlCode[CurlCode["CURLE_LAST"] = 99] = "CURLE_LAST";
    /*  compatibility with older names */
    CurlCode[CurlCode["CURLE_FTP_WEIRD_SERVER_REPLY"] = 8] = "CURLE_FTP_WEIRD_SERVER_REPLY";
    CurlCode[CurlCode["CURLE_SSL_CACERT"] = 60] = "CURLE_SSL_CACERT";
    CurlCode[CurlCode["CURLE_UNKNOWN_TELNET_OPTION"] = 48] = "CURLE_UNKNOWN_TELNET_OPTION";
    CurlCode[CurlCode["CURLE_SSL_PEER_CERTIFICATE"] = 60] = "CURLE_SSL_PEER_CERTIFICATE";
    CurlCode[CurlCode["CURLE_TELNET_OPTION_SYNTAX"] = 49] = "CURLE_TELNET_OPTION_SYNTAX";
    CurlCode[CurlCode["CURLE_FTP_ACCESS_DENIED"] = 9] = "CURLE_FTP_ACCESS_DENIED";
    CurlCode[CurlCode["CURLE_FTP_COULDNT_SET_BINARY"] = 17] = "CURLE_FTP_COULDNT_SET_BINARY";
    CurlCode[CurlCode["CURLE_FTP_QUOTE_ERROR"] = 21] = "CURLE_FTP_QUOTE_ERROR";
    CurlCode[CurlCode["CURLE_TFTP_DISKFULL"] = 70] = "CURLE_TFTP_DISKFULL";
    CurlCode[CurlCode["CURLE_TFTP_EXISTS"] = 73] = "CURLE_TFTP_EXISTS";
    CurlCode[CurlCode["CURLE_HTTP_RANGE_ERROR"] = 33] = "CURLE_HTTP_RANGE_ERROR";
    CurlCode[CurlCode["CURLE_FTP_SSL_FAILED"] = 64] = "CURLE_FTP_SSL_FAILED";
    /* The following were added earlier */
    CurlCode[CurlCode["CURLE_OPERATION_TIMEOUTED"] = 28] = "CURLE_OPERATION_TIMEOUTED";
    CurlCode[CurlCode["CURLE_HTTP_NOT_FOUND"] = 22] = "CURLE_HTTP_NOT_FOUND";
    CurlCode[CurlCode["CURLE_HTTP_PORT_FAILED"] = 45] = "CURLE_HTTP_PORT_FAILED";
    CurlCode[CurlCode["CURLE_FTP_COULDNT_STOR_FILE"] = 25] = "CURLE_FTP_COULDNT_STOR_FILE";
    CurlCode[CurlCode["CURLE_FTP_PARTIAL_FILE"] = 18] = "CURLE_FTP_PARTIAL_FILE";
    CurlCode[CurlCode["CURLE_FTP_BAD_DOWNLOAD_RESUME"] = 36] = "CURLE_FTP_BAD_DOWNLOAD_RESUME";
})(CurlCode || (exports.CurlCode = CurlCode = {}));
// https://github.com/curl/curl/blob/e1be825453/include/curl/curl.h#L2675
/**
 * @public
 */
var CurlShareCode;
(function (CurlShareCode) {
    CurlShareCode[CurlShareCode["CURLSHE_OK"] = 0] = "CURLSHE_OK"; /* all is fine */
    CurlShareCode[CurlShareCode["CURLSHE_BAD_OPTION"] = 1] = "CURLSHE_BAD_OPTION"; /* 1 */
    CurlShareCode[CurlShareCode["CURLSHE_IN_USE"] = 2] = "CURLSHE_IN_USE"; /* 2 */
    CurlShareCode[CurlShareCode["CURLSHE_INVALID"] = 3] = "CURLSHE_INVALID"; /* 3 */
    CurlShareCode[CurlShareCode["CURLSHE_NOMEM"] = 4] = "CURLSHE_NOMEM"; /* 4 out of memory */
    CurlShareCode[CurlShareCode["CURLSHE_NOT_BUILT_IN"] = 5] = "CURLSHE_NOT_BUILT_IN"; /* 5 feature not present in lib */
    CurlShareCode[CurlShareCode["CURLSHE_LAST"] = 6] = "CURLSHE_LAST";
})(CurlShareCode || (exports.CurlShareCode = CurlShareCode = {}));
//# sourceMappingURL=CurlCode.js.map

/***/ }),

/***/ 5539:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlFeature = void 0;
/**
 * Flags to be used with {@link "Curl".Curl.enable | `Curl#enable`} and {@link "Curl".Curl.disable | `Curl#disable`}
 * @public
 */
var CurlFeature;
(function (CurlFeature) {
    /**
     * Initial state
     */
    CurlFeature[CurlFeature["Empty"] = 0] = "Empty";
    /**
     * Data received is passed as a Buffer to the end event.
     */
    CurlFeature[CurlFeature["NoDataParsing"] = 1] = "NoDataParsing";
    /**
     * Header received is not parsed, it's passed as a Buffer to the end event.
     */
    CurlFeature[CurlFeature["NoHeaderParsing"] = 2] = "NoHeaderParsing";
    /**
     * Same than `NoDataParsing | NoHeaderParsing`
     */
    CurlFeature[CurlFeature["Raw"] = 3] = "Raw";
    /**
     * Data received is not stored inside this handle, implies `NoDataParsing`.
     */
    CurlFeature[CurlFeature["NoDataStorage"] = 4] = "NoDataStorage";
    /**
     * Header received is not stored inside this handle, implies `NoHeaderParsing`.
     */
    CurlFeature[CurlFeature["NoHeaderStorage"] = 8] = "NoHeaderStorage";
    /**
     * Same than `NoDataStorage | NoHeaderStorage`, implies `Raw`.
     */
    CurlFeature[CurlFeature["NoStorage"] = 12] = "NoStorage";
    /**
     * This will change the behavior of the internal `WRITEFUNCTION` to push data into a stream instead of
     * buffering all the data into multiple `Buffer` chunks.
     *
     * As soon as the stream is available, it will be passed as the first argument for the `stream` event.
     *
     * Example usage:
     *
     * ```typescript
     *  const curl = new Curl()
     *  curl.setOpt('URL', 'https://some-domain/upload')
     *
     *  curl.setStreamProgressCallback(() => {
     *    // this will use the default progress callback from libcurl
     *    return CurlProgressFunc.Continue
     *  })
     *
     *  curl.on('end', (statusCode, data) => {
     *    console.log('\n'.repeat(5))
     *    console.log(
     *      `curl - end - status: ${statusCode} - data length: ${data.length}`,
     *    )
     *    curl.close()
     *  })
     *  curl.on('error', (error, errorCode) => {
     *    console.log('\n'.repeat(5))
     *    console.error('curl - error: ', error, errorCode)
     *    curl.close()
     *  })
     *  curl.on('stream', async (stream, _statusCode, _headers) => {
     *    const writableStream = fs.createWriteStream('./test.out')
     *    stream.pipe(writableStream)
     *  })
     *  curl.perform()
     * ```
     *
     * Using this implies `NoDataStorage`.
     *
     * To control the `highWaterMark` option of the response stream, see {@link "Curl".Curl.setStreamResponseHighWaterMark | `Curl#setStreamResponseHighWaterMark`}
     *
     * @remarks
     *
     * Make sure your libcurl version is greater than or equal 7.69.1.
     * Versions older than that one are not reliable for streams usage.
     */
    CurlFeature[CurlFeature["StreamResponse"] = 16] = "StreamResponse";
})(CurlFeature || (exports.CurlFeature = CurlFeature = {}));
//# sourceMappingURL=CurlFeature.js.map

/***/ }),

/***/ 5302:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlPause = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254/include/curl/curl.h#L2828
/**
 * Options to be used with {@link "Easy".Easy.pause | `Easy#pause`} and {@link "Curl".Curl.pause | `Curl#pause`}.
 *
 * `CURLPAUSE_RECV_CONT` becomes `CurlPause.RecvCont`
 *
 * @public
 */
var CurlPause;
(function (CurlPause) {
    CurlPause[CurlPause["Recv"] = 1] = "Recv";
    CurlPause[CurlPause["RecvCont"] = 0] = "RecvCont";
    CurlPause[CurlPause["Send"] = 4] = "Send";
    CurlPause[CurlPause["SendCont"] = 0] = "SendCont";
    CurlPause[CurlPause["All"] = 5] = "All";
    CurlPause[CurlPause["Cont"] = 0] = "Cont";
})(CurlPause || (exports.CurlPause = CurlPause = {}));
//# sourceMappingURL=CurlPause.js.map

/***/ }),

/***/ 6426:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlReadFunc = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L361-L366
/**
 * Special return codes for `READFUNCTION` option
 *
 * `CURL_READFUNC_ABORT` becomes `CurlReadFunc.Abort`
 *
 * @public
 */
var CurlReadFunc;
(function (CurlReadFunc) {
    CurlReadFunc[CurlReadFunc["Abort"] = 268435456] = "Abort";
    CurlReadFunc[CurlReadFunc["Pause"] = 268435457] = "Pause";
})(CurlReadFunc || (exports.CurlReadFunc = CurlReadFunc = {}));
//# sourceMappingURL=CurlReadFunc.js.map

/***/ }),

/***/ 9531:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlWriteFunc = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
// https://github.com/curl/curl/blob/e1be8254534898fccafc5d6cd04f6235f283cfbd/include/curl/curl.h#L252
/**
 * Special return codes for `WRITEFUNCTION` option
 *
 * `CURL_WRITEFUNC_PAUSE` becomes `CurlWriteFunc.Pause`
 *
 * @public
 */
var CurlWriteFunc;
(function (CurlWriteFunc) {
    CurlWriteFunc[CurlWriteFunc["Pause"] = 268435457] = "Pause";
})(CurlWriteFunc || (exports.CurlWriteFunc = CurlWriteFunc = {}));
//# sourceMappingURL=CurlWriteFunc.js.map

/***/ }),

/***/ 9799:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlCode = exports.Easy = exports.Curl = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * node-libcurl
 * @packageDocumentation
 */
var Curl_1 = __nccwpck_require__(4608);
Object.defineProperty(exports, "Curl", ({ enumerable: true, get: function () { return Curl_1.Curl; } }));
var Easy_1 = __nccwpck_require__(1517);
Object.defineProperty(exports, "Easy", ({ enumerable: true, get: function () { return Easy_1.Easy; } }));
var CurlCode_1 = __nccwpck_require__(3625);
Object.defineProperty(exports, "CurlCode", ({ enumerable: true, get: function () { return CurlCode_1.CurlCode; } }));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 80:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mergeChunks = void 0;
/**
 * Copyright (c) Jonathan Cardoso Machado. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
/**
 * This function is used to merge the buffers
 *  that were stored while the request was being processed.
 *
 * @internal
 */
function mergeChunks(chunks, length) {
    // We init the whole buffer below, so no need to use, the slower, Buffer.alloc
    const buffer = Buffer.allocUnsafe(length);
    const chunksLen = chunks.length;
    let currentPos = 0;
    for (let i = 0; i < chunksLen; i += 1) {
        const chunk = chunks[i];
        chunk.copy(buffer, currentPos);
        currentPos += chunk.length;
    }
    return buffer;
}
exports.mergeChunks = mergeChunks;
//# sourceMappingURL=mergeChunks.js.map

/***/ }),

/***/ 1920:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseHeaders = void 0;
/**
 * Parses the headers that were stored while
 *  the request was being processed.
 *
 * @internal
 */
function parseHeaders(headersString) {
    const headers = headersString.split(/\r?\n|\r/g);
    const len = headers.length;
    const result = [];
    let isStatusLine = true;
    let currHeaders = {};
    for (let i = 0; i < len; i += 1) {
        // status line
        if (isStatusLine) {
            const header = headers[i].split(' ');
            currHeaders.result = {
                version: header.shift() || '',
                code: parseInt(header.shift() || '0', 10),
                reason: header.join(' '),
            };
            isStatusLine = false;
            continue;
        }
        // Empty string means empty line, which means another header group
        if (headers[i] === '') {
            result.push(currHeaders);
            currHeaders = {};
            isStatusLine = true;
            continue;
        }
        const header = headers[i].split(/:\s(.+)/);
        if (header[0].toUpperCase() === 'SET-COOKIE') {
            if (!currHeaders['Set-Cookie']) {
                currHeaders['Set-Cookie'] = [];
            }
            currHeaders['Set-Cookie'].push(header[1]);
        }
        else {
            currHeaders[header[0]] = header[1];
        }
    }
    return result;
}
exports.parseHeaders = parseHeaders;
//# sourceMappingURL=parseHeaders.js.map

/***/ }),

/***/ 5388:
/***/ ((module) => {

/*!
 * normalize-path <https://github.com/jonschlinkert/normalize-path>
 *
 * Copyright (c) 2014-2018, Jon Schlinkert.
 * Released under the MIT License.
 */

module.exports = function(path, stripTrailing) {
  if (typeof path !== 'string') {
    throw new TypeError('expected path to be a string');
  }

  if (path === '\\' || path === '/') return '/';

  var len = path.length;
  if (len <= 1) return path;

  // ensure that win32 namespaces has two leading slashes, so that the path is
  // handled properly by the win32 version of path.parse() after being normalized
  // https://msdn.microsoft.com/library/windows/desktop/aa365247(v=vs.85).aspx#namespaces
  var prefix = '';
  if (len > 4 && path[3] === '\\') {
    var ch = path[2];
    if ((ch === '?' || ch === '.') && path.slice(0, 2) === '\\\\') {
      path = path.slice(2);
      prefix = '//';
    }
  }

  var segs = path.split(/[/\\]+/);
  if (stripTrailing !== false && segs[segs.length - 1] === '') {
    segs.pop();
  }
  return prefix + segs.join('/');
};


/***/ }),

/***/ 8569:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


module.exports = __nccwpck_require__(3322);


/***/ }),

/***/ 6099:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(1017);
const WIN_SLASH = '\\\\/';
const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

/**
 * Posix glob regex
 */

const DOT_LITERAL = '\\.';
const PLUS_LITERAL = '\\+';
const QMARK_LITERAL = '\\?';
const SLASH_LITERAL = '\\/';
const ONE_CHAR = '(?=.)';
const QMARK = '[^/]';
const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
const NO_DOT = `(?!${DOT_LITERAL})`;
const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
const STAR = `${QMARK}*?`;

const POSIX_CHARS = {
  DOT_LITERAL,
  PLUS_LITERAL,
  QMARK_LITERAL,
  SLASH_LITERAL,
  ONE_CHAR,
  QMARK,
  END_ANCHOR,
  DOTS_SLASH,
  NO_DOT,
  NO_DOTS,
  NO_DOT_SLASH,
  NO_DOTS_SLASH,
  QMARK_NO_DOT,
  STAR,
  START_ANCHOR
};

/**
 * Windows glob regex
 */

const WINDOWS_CHARS = {
  ...POSIX_CHARS,

  SLASH_LITERAL: `[${WIN_SLASH}]`,
  QMARK: WIN_NO_SLASH,
  STAR: `${WIN_NO_SLASH}*?`,
  DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
  NO_DOT: `(?!${DOT_LITERAL})`,
  NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
  NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
  QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
  START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
  END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
};

/**
 * POSIX Bracket Regex
 */

const POSIX_REGEX_SOURCE = {
  alnum: 'a-zA-Z0-9',
  alpha: 'a-zA-Z',
  ascii: '\\x00-\\x7F',
  blank: ' \\t',
  cntrl: '\\x00-\\x1F\\x7F',
  digit: '0-9',
  graph: '\\x21-\\x7E',
  lower: 'a-z',
  print: '\\x20-\\x7E ',
  punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
  space: ' \\t\\r\\n\\v\\f',
  upper: 'A-Z',
  word: 'A-Za-z0-9_',
  xdigit: 'A-Fa-f0-9'
};

module.exports = {
  MAX_LENGTH: 1024 * 64,
  POSIX_REGEX_SOURCE,

  // regular expressions
  REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
  REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
  REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
  REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
  REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
  REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

  // Replace globs with equivalent patterns to reduce parsing time.
  REPLACEMENTS: {
    '***': '*',
    '**/**': '**',
    '**/**/**': '**'
  },

  // Digits
  CHAR_0: 48, /* 0 */
  CHAR_9: 57, /* 9 */

  // Alphabet chars.
  CHAR_UPPERCASE_A: 65, /* A */
  CHAR_LOWERCASE_A: 97, /* a */
  CHAR_UPPERCASE_Z: 90, /* Z */
  CHAR_LOWERCASE_Z: 122, /* z */

  CHAR_LEFT_PARENTHESES: 40, /* ( */
  CHAR_RIGHT_PARENTHESES: 41, /* ) */

  CHAR_ASTERISK: 42, /* * */

  // Non-alphabetic chars.
  CHAR_AMPERSAND: 38, /* & */
  CHAR_AT: 64, /* @ */
  CHAR_BACKWARD_SLASH: 92, /* \ */
  CHAR_CARRIAGE_RETURN: 13, /* \r */
  CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
  CHAR_COLON: 58, /* : */
  CHAR_COMMA: 44, /* , */
  CHAR_DOT: 46, /* . */
  CHAR_DOUBLE_QUOTE: 34, /* " */
  CHAR_EQUAL: 61, /* = */
  CHAR_EXCLAMATION_MARK: 33, /* ! */
  CHAR_FORM_FEED: 12, /* \f */
  CHAR_FORWARD_SLASH: 47, /* / */
  CHAR_GRAVE_ACCENT: 96, /* ` */
  CHAR_HASH: 35, /* # */
  CHAR_HYPHEN_MINUS: 45, /* - */
  CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
  CHAR_LEFT_CURLY_BRACE: 123, /* { */
  CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
  CHAR_LINE_FEED: 10, /* \n */
  CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
  CHAR_PERCENT: 37, /* % */
  CHAR_PLUS: 43, /* + */
  CHAR_QUESTION_MARK: 63, /* ? */
  CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
  CHAR_RIGHT_CURLY_BRACE: 125, /* } */
  CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
  CHAR_SEMICOLON: 59, /* ; */
  CHAR_SINGLE_QUOTE: 39, /* ' */
  CHAR_SPACE: 32, /*   */
  CHAR_TAB: 9, /* \t */
  CHAR_UNDERSCORE: 95, /* _ */
  CHAR_VERTICAL_LINE: 124, /* | */
  CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

  SEP: path.sep,

  /**
   * Create EXTGLOB_CHARS
   */

  extglobChars(chars) {
    return {
      '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
      '?': { type: 'qmark', open: '(?:', close: ')?' },
      '+': { type: 'plus', open: '(?:', close: ')+' },
      '*': { type: 'star', open: '(?:', close: ')*' },
      '@': { type: 'at', open: '(?:', close: ')' }
    };
  },

  /**
   * Create GLOB_CHARS
   */

  globChars(win32) {
    return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
  }
};


/***/ }),

/***/ 2139:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const constants = __nccwpck_require__(6099);
const utils = __nccwpck_require__(479);

/**
 * Constants
 */

const {
  MAX_LENGTH,
  POSIX_REGEX_SOURCE,
  REGEX_NON_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_BACKREF,
  REPLACEMENTS
} = constants;

/**
 * Helpers
 */

const expandRange = (args, options) => {
  if (typeof options.expandRange === 'function') {
    return options.expandRange(...args, options);
  }

  args.sort();
  const value = `[${args.join('-')}]`;

  try {
    /* eslint-disable-next-line no-new */
    new RegExp(value);
  } catch (ex) {
    return args.map(v => utils.escapeRegex(v)).join('..');
  }

  return value;
};

/**
 * Create the message for a syntax error
 */

const syntaxError = (type, char) => {
  return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
};

/**
 * Parse the given input string.
 * @param {String} input
 * @param {Object} options
 * @return {Object}
 */

const parse = (input, options) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected a string');
  }

  input = REPLACEMENTS[input] || input;

  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

  let len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  const bos = { type: 'bos', value: '', output: opts.prepend || '' };
  const tokens = [bos];

  const capture = opts.capture ? '' : '?:';
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const PLATFORM_CHARS = constants.globChars(win32);
  const EXTGLOB_CHARS = constants.extglobChars(PLATFORM_CHARS);

  const {
    DOT_LITERAL,
    PLUS_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOT_SLASH,
    NO_DOTS_SLASH,
    QMARK,
    QMARK_NO_DOT,
    STAR,
    START_ANCHOR
  } = PLATFORM_CHARS;

  const globstar = opts => {
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const nodot = opts.dot ? '' : NO_DOT;
  const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
  let star = opts.bash === true ? globstar(opts) : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  // minimatch options support
  if (typeof opts.noext === 'boolean') {
    opts.noextglob = opts.noext;
  }

  const state = {
    input,
    index: -1,
    start: 0,
    dot: opts.dot === true,
    consumed: '',
    output: '',
    prefix: '',
    backtrack: false,
    negated: false,
    brackets: 0,
    braces: 0,
    parens: 0,
    quotes: 0,
    globstar: false,
    tokens
  };

  input = utils.removePrefix(input, state);
  len = input.length;

  const extglobs = [];
  const braces = [];
  const stack = [];
  let prev = bos;
  let value;

  /**
   * Tokenizing helpers
   */

  const eos = () => state.index === len - 1;
  const peek = state.peek = (n = 1) => input[state.index + n];
  const advance = state.advance = () => input[++state.index] || '';
  const remaining = () => input.slice(state.index + 1);
  const consume = (value = '', num = 0) => {
    state.consumed += value;
    state.index += num;
  };

  const append = token => {
    state.output += token.output != null ? token.output : token.value;
    consume(token.value);
  };

  const negate = () => {
    let count = 1;

    while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
      advance();
      state.start++;
      count++;
    }

    if (count % 2 === 0) {
      return false;
    }

    state.negated = true;
    state.start++;
    return true;
  };

  const increment = type => {
    state[type]++;
    stack.push(type);
  };

  const decrement = type => {
    state[type]--;
    stack.pop();
  };

  /**
   * Push tokens onto the tokens array. This helper speeds up
   * tokenizing by 1) helping us avoid backtracking as much as possible,
   * and 2) helping us avoid creating extra tokens when consecutive
   * characters are plain text. This improves performance and simplifies
   * lookbehinds.
   */

  const push = tok => {
    if (prev.type === 'globstar') {
      const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
      const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

      if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
        state.output = state.output.slice(0, -prev.output.length);
        prev.type = 'star';
        prev.value = '*';
        prev.output = star;
        state.output += prev.output;
      }
    }

    if (extglobs.length && tok.type !== 'paren') {
      extglobs[extglobs.length - 1].inner += tok.value;
    }

    if (tok.value || tok.output) append(tok);
    if (prev && prev.type === 'text' && tok.type === 'text') {
      prev.value += tok.value;
      prev.output = (prev.output || '') + tok.value;
      return;
    }

    tok.prev = prev;
    tokens.push(tok);
    prev = tok;
  };

  const extglobOpen = (type, value) => {
    const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

    token.prev = prev;
    token.parens = state.parens;
    token.output = state.output;
    const output = (opts.capture ? '(' : '') + token.open;

    increment('parens');
    push({ type, value, output: state.output ? '' : ONE_CHAR });
    push({ type: 'paren', extglob: true, value: advance(), output });
    extglobs.push(token);
  };

  const extglobClose = token => {
    let output = token.close + (opts.capture ? ')' : '');
    let rest;

    if (token.type === 'negate') {
      let extglobStar = star;

      if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
        extglobStar = globstar(opts);
      }

      if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
        output = token.close = `)$))${extglobStar}`;
      }

      if (token.inner.includes('*') && (rest = remaining()) && /^\.[^\\/.]+$/.test(rest)) {
        // Any non-magical string (`.ts`) or even nested expression (`.{ts,tsx}`) can follow after the closing parenthesis.
        // In this case, we need to parse the string and use it in the output of the original pattern.
        // Suitable patterns: `/!(*.d).ts`, `/!(*.d).{ts,tsx}`, `**/!(*-dbg).@(js)`.
        //
        // Disabling the `fastpaths` option due to a problem with parsing strings as `.ts` in the pattern like `**/!(*.d).ts`.
        const expression = parse(rest, { ...options, fastpaths: false }).output;

        output = token.close = `)${expression})${extglobStar})`;
      }

      if (token.prev.type === 'bos') {
        state.negatedExtglob = true;
      }
    }

    push({ type: 'paren', extglob: true, value, output });
    decrement('parens');
  };

  /**
   * Fast paths
   */

  if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
    let backslashes = false;

    let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
      if (first === '\\') {
        backslashes = true;
        return m;
      }

      if (first === '?') {
        if (esc) {
          return esc + first + (rest ? QMARK.repeat(rest.length) : '');
        }
        if (index === 0) {
          return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
        }
        return QMARK.repeat(chars.length);
      }

      if (first === '.') {
        return DOT_LITERAL.repeat(chars.length);
      }

      if (first === '*') {
        if (esc) {
          return esc + first + (rest ? star : '');
        }
        return star;
      }
      return esc ? m : `\\${m}`;
    });

    if (backslashes === true) {
      if (opts.unescape === true) {
        output = output.replace(/\\/g, '');
      } else {
        output = output.replace(/\\+/g, m => {
          return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
        });
      }
    }

    if (output === input && opts.contains === true) {
      state.output = input;
      return state;
    }

    state.output = utils.wrapOutput(output, state, options);
    return state;
  }

  /**
   * Tokenize input until we reach end-of-string
   */

  while (!eos()) {
    value = advance();

    if (value === '\u0000') {
      continue;
    }

    /**
     * Escaped characters
     */

    if (value === '\\') {
      const next = peek();

      if (next === '/' && opts.bash !== true) {
        continue;
      }

      if (next === '.' || next === ';') {
        continue;
      }

      if (!next) {
        value += '\\';
        push({ type: 'text', value });
        continue;
      }

      // collapse slashes to reduce potential for exploits
      const match = /^\\+/.exec(remaining());
      let slashes = 0;

      if (match && match[0].length > 2) {
        slashes = match[0].length;
        state.index += slashes;
        if (slashes % 2 !== 0) {
          value += '\\';
        }
      }

      if (opts.unescape === true) {
        value = advance();
      } else {
        value += advance();
      }

      if (state.brackets === 0) {
        push({ type: 'text', value });
        continue;
      }
    }

    /**
     * If we're inside a regex character class, continue
     * until we reach the closing bracket.
     */

    if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
      if (opts.posix !== false && value === ':') {
        const inner = prev.value.slice(1);
        if (inner.includes('[')) {
          prev.posix = true;

          if (inner.includes(':')) {
            const idx = prev.value.lastIndexOf('[');
            const pre = prev.value.slice(0, idx);
            const rest = prev.value.slice(idx + 2);
            const posix = POSIX_REGEX_SOURCE[rest];
            if (posix) {
              prev.value = pre + posix;
              state.backtrack = true;
              advance();

              if (!bos.output && tokens.indexOf(prev) === 1) {
                bos.output = ONE_CHAR;
              }
              continue;
            }
          }
        }
      }

      if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
        value = `\\${value}`;
      }

      if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
        value = `\\${value}`;
      }

      if (opts.posix === true && value === '!' && prev.value === '[') {
        value = '^';
      }

      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * If we're inside a quoted string, continue
     * until we reach the closing double quote.
     */

    if (state.quotes === 1 && value !== '"') {
      value = utils.escapeRegex(value);
      prev.value += value;
      append({ value });
      continue;
    }

    /**
     * Double quotes
     */

    if (value === '"') {
      state.quotes = state.quotes === 1 ? 0 : 1;
      if (opts.keepQuotes === true) {
        push({ type: 'text', value });
      }
      continue;
    }

    /**
     * Parentheses
     */

    if (value === '(') {
      increment('parens');
      push({ type: 'paren', value });
      continue;
    }

    if (value === ')') {
      if (state.parens === 0 && opts.strictBrackets === true) {
        throw new SyntaxError(syntaxError('opening', '('));
      }

      const extglob = extglobs[extglobs.length - 1];
      if (extglob && state.parens === extglob.parens + 1) {
        extglobClose(extglobs.pop());
        continue;
      }

      push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
      decrement('parens');
      continue;
    }

    /**
     * Square brackets
     */

    if (value === '[') {
      if (opts.nobracket === true || !remaining().includes(']')) {
        if (opts.nobracket !== true && opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('closing', ']'));
        }

        value = `\\${value}`;
      } else {
        increment('brackets');
      }

      push({ type: 'bracket', value });
      continue;
    }

    if (value === ']') {
      if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      if (state.brackets === 0) {
        if (opts.strictBrackets === true) {
          throw new SyntaxError(syntaxError('opening', '['));
        }

        push({ type: 'text', value, output: `\\${value}` });
        continue;
      }

      decrement('brackets');

      const prevValue = prev.value.slice(1);
      if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
        value = `/${value}`;
      }

      prev.value += value;
      append({ value });

      // when literal brackets are explicitly disabled
      // assume we should match with a regex character class
      if (opts.literalBrackets === false || utils.hasRegexChars(prevValue)) {
        continue;
      }

      const escaped = utils.escapeRegex(prev.value);
      state.output = state.output.slice(0, -prev.value.length);

      // when literal brackets are explicitly enabled
      // assume we should escape the brackets to match literal characters
      if (opts.literalBrackets === true) {
        state.output += escaped;
        prev.value = escaped;
        continue;
      }

      // when the user specifies nothing, try to match both
      prev.value = `(${capture}${escaped}|${prev.value})`;
      state.output += prev.value;
      continue;
    }

    /**
     * Braces
     */

    if (value === '{' && opts.nobrace !== true) {
      increment('braces');

      const open = {
        type: 'brace',
        value,
        output: '(',
        outputIndex: state.output.length,
        tokensIndex: state.tokens.length
      };

      braces.push(open);
      push(open);
      continue;
    }

    if (value === '}') {
      const brace = braces[braces.length - 1];

      if (opts.nobrace === true || !brace) {
        push({ type: 'text', value, output: value });
        continue;
      }

      let output = ')';

      if (brace.dots === true) {
        const arr = tokens.slice();
        const range = [];

        for (let i = arr.length - 1; i >= 0; i--) {
          tokens.pop();
          if (arr[i].type === 'brace') {
            break;
          }
          if (arr[i].type !== 'dots') {
            range.unshift(arr[i].value);
          }
        }

        output = expandRange(range, opts);
        state.backtrack = true;
      }

      if (brace.comma !== true && brace.dots !== true) {
        const out = state.output.slice(0, brace.outputIndex);
        const toks = state.tokens.slice(brace.tokensIndex);
        brace.value = brace.output = '\\{';
        value = output = '\\}';
        state.output = out;
        for (const t of toks) {
          state.output += (t.output || t.value);
        }
      }

      push({ type: 'brace', value, output });
      decrement('braces');
      braces.pop();
      continue;
    }

    /**
     * Pipes
     */

    if (value === '|') {
      if (extglobs.length > 0) {
        extglobs[extglobs.length - 1].conditions++;
      }
      push({ type: 'text', value });
      continue;
    }

    /**
     * Commas
     */

    if (value === ',') {
      let output = value;

      const brace = braces[braces.length - 1];
      if (brace && stack[stack.length - 1] === 'braces') {
        brace.comma = true;
        output = '|';
      }

      push({ type: 'comma', value, output });
      continue;
    }

    /**
     * Slashes
     */

    if (value === '/') {
      // if the beginning of the glob is "./", advance the start
      // to the current index, and don't add the "./" characters
      // to the state. This greatly simplifies lookbehinds when
      // checking for BOS characters like "!" and "." (not "./")
      if (prev.type === 'dot' && state.index === state.start + 1) {
        state.start = state.index + 1;
        state.consumed = '';
        state.output = '';
        tokens.pop();
        prev = bos; // reset "prev" to the first token
        continue;
      }

      push({ type: 'slash', value, output: SLASH_LITERAL });
      continue;
    }

    /**
     * Dots
     */

    if (value === '.') {
      if (state.braces > 0 && prev.type === 'dot') {
        if (prev.value === '.') prev.output = DOT_LITERAL;
        const brace = braces[braces.length - 1];
        prev.type = 'dots';
        prev.output += value;
        prev.value += value;
        brace.dots = true;
        continue;
      }

      if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
        push({ type: 'text', value, output: DOT_LITERAL });
        continue;
      }

      push({ type: 'dot', value, output: DOT_LITERAL });
      continue;
    }

    /**
     * Question marks
     */

    if (value === '?') {
      const isGroup = prev && prev.value === '(';
      if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('qmark', value);
        continue;
      }

      if (prev && prev.type === 'paren') {
        const next = peek();
        let output = value;

        if (next === '<' && !utils.supportsLookbehinds()) {
          throw new Error('Node.js v10 or higher is required for regex lookbehinds');
        }

        if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
          output = `\\${value}`;
        }

        push({ type: 'text', value, output });
        continue;
      }

      if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
        push({ type: 'qmark', value, output: QMARK_NO_DOT });
        continue;
      }

      push({ type: 'qmark', value, output: QMARK });
      continue;
    }

    /**
     * Exclamation
     */

    if (value === '!') {
      if (opts.noextglob !== true && peek() === '(') {
        if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
          extglobOpen('negate', value);
          continue;
        }
      }

      if (opts.nonegate !== true && state.index === 0) {
        negate();
        continue;
      }
    }

    /**
     * Plus
     */

    if (value === '+') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        extglobOpen('plus', value);
        continue;
      }

      if ((prev && prev.value === '(') || opts.regex === false) {
        push({ type: 'plus', value, output: PLUS_LITERAL });
        continue;
      }

      if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
        push({ type: 'plus', value });
        continue;
      }

      push({ type: 'plus', value: PLUS_LITERAL });
      continue;
    }

    /**
     * Plain text
     */

    if (value === '@') {
      if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
        push({ type: 'at', extglob: true, value, output: '' });
        continue;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Plain text
     */

    if (value !== '*') {
      if (value === '$' || value === '^') {
        value = `\\${value}`;
      }

      const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
      if (match) {
        value += match[0];
        state.index += match[0].length;
      }

      push({ type: 'text', value });
      continue;
    }

    /**
     * Stars
     */

    if (prev && (prev.type === 'globstar' || prev.star === true)) {
      prev.type = 'star';
      prev.star = true;
      prev.value += value;
      prev.output = star;
      state.backtrack = true;
      state.globstar = true;
      consume(value);
      continue;
    }

    let rest = remaining();
    if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
      extglobOpen('star', value);
      continue;
    }

    if (prev.type === 'star') {
      if (opts.noglobstar === true) {
        consume(value);
        continue;
      }

      const prior = prev.prev;
      const before = prior.prev;
      const isStart = prior.type === 'slash' || prior.type === 'bos';
      const afterStar = before && (before.type === 'star' || before.type === 'globstar');

      if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
      const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
      if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
        push({ type: 'star', value, output: '' });
        continue;
      }

      // strip consecutive `/**/`
      while (rest.slice(0, 3) === '/**') {
        const after = input[state.index + 4];
        if (after && after !== '/') {
          break;
        }
        rest = rest.slice(3);
        consume('/**', 3);
      }

      if (prior.type === 'bos' && eos()) {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = globstar(opts);
        state.output = prev.output;
        state.globstar = true;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
        prev.value += value;
        state.globstar = true;
        state.output += prior.output + prev.output;
        consume(value);
        continue;
      }

      if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
        const end = rest[1] !== void 0 ? '|$' : '';

        state.output = state.output.slice(0, -(prior.output + prev.output).length);
        prior.output = `(?:${prior.output}`;

        prev.type = 'globstar';
        prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
        prev.value += value;

        state.output += prior.output + prev.output;
        state.globstar = true;

        consume(value + advance());

        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      if (prior.type === 'bos' && rest[0] === '/') {
        prev.type = 'globstar';
        prev.value += value;
        prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
        state.output = prev.output;
        state.globstar = true;
        consume(value + advance());
        push({ type: 'slash', value: '/', output: '' });
        continue;
      }

      // remove single star from output
      state.output = state.output.slice(0, -prev.output.length);

      // reset previous token to globstar
      prev.type = 'globstar';
      prev.output = globstar(opts);
      prev.value += value;

      // reset output with globstar
      state.output += prev.output;
      state.globstar = true;
      consume(value);
      continue;
    }

    const token = { type: 'star', value, output: star };

    if (opts.bash === true) {
      token.output = '.*?';
      if (prev.type === 'bos' || prev.type === 'slash') {
        token.output = nodot + token.output;
      }
      push(token);
      continue;
    }

    if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
      token.output = value;
      push(token);
      continue;
    }

    if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
      if (prev.type === 'dot') {
        state.output += NO_DOT_SLASH;
        prev.output += NO_DOT_SLASH;

      } else if (opts.dot === true) {
        state.output += NO_DOTS_SLASH;
        prev.output += NO_DOTS_SLASH;

      } else {
        state.output += nodot;
        prev.output += nodot;
      }

      if (peek() !== '*') {
        state.output += ONE_CHAR;
        prev.output += ONE_CHAR;
      }
    }

    push(token);
  }

  while (state.brackets > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
    state.output = utils.escapeLast(state.output, '[');
    decrement('brackets');
  }

  while (state.parens > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
    state.output = utils.escapeLast(state.output, '(');
    decrement('parens');
  }

  while (state.braces > 0) {
    if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
    state.output = utils.escapeLast(state.output, '{');
    decrement('braces');
  }

  if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
    push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
  }

  // rebuild the output if we had to backtrack at any point
  if (state.backtrack === true) {
    state.output = '';

    for (const token of state.tokens) {
      state.output += token.output != null ? token.output : token.value;

      if (token.suffix) {
        state.output += token.suffix;
      }
    }
  }

  return state;
};

/**
 * Fast paths for creating regular expressions for common glob patterns.
 * This can significantly speed up processing and has very little downside
 * impact when none of the fast paths match.
 */

parse.fastpaths = (input, options) => {
  const opts = { ...options };
  const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
  const len = input.length;
  if (len > max) {
    throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
  }

  input = REPLACEMENTS[input] || input;
  const win32 = utils.isWindows(options);

  // create constants based on platform, for windows or posix
  const {
    DOT_LITERAL,
    SLASH_LITERAL,
    ONE_CHAR,
    DOTS_SLASH,
    NO_DOT,
    NO_DOTS,
    NO_DOTS_SLASH,
    STAR,
    START_ANCHOR
  } = constants.globChars(win32);

  const nodot = opts.dot ? NO_DOTS : NO_DOT;
  const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
  const capture = opts.capture ? '' : '?:';
  const state = { negated: false, prefix: '' };
  let star = opts.bash === true ? '.*?' : STAR;

  if (opts.capture) {
    star = `(${star})`;
  }

  const globstar = opts => {
    if (opts.noglobstar === true) return star;
    return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
  };

  const create = str => {
    switch (str) {
      case '*':
        return `${nodot}${ONE_CHAR}${star}`;

      case '.*':
        return `${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*.*':
        return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '*/*':
        return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

      case '**':
        return nodot + globstar(opts);

      case '**/*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

      case '**/*.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

      case '**/.*':
        return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

      default: {
        const match = /^(.*?)\.(\w+)$/.exec(str);
        if (!match) return;

        const source = create(match[1]);
        if (!source) return;

        return source + DOT_LITERAL + match[2];
      }
    }
  };

  const output = utils.removePrefix(input, state);
  let source = create(output);

  if (source && opts.strictSlashes !== true) {
    source += `${SLASH_LITERAL}?`;
  }

  return source;
};

module.exports = parse;


/***/ }),

/***/ 3322:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(1017);
const scan = __nccwpck_require__(2429);
const parse = __nccwpck_require__(2139);
const utils = __nccwpck_require__(479);
const constants = __nccwpck_require__(6099);
const isObject = val => val && typeof val === 'object' && !Array.isArray(val);

/**
 * Creates a matcher function from one or more glob patterns. The
 * returned function takes a string to match as its first argument,
 * and returns true if the string is a match. The returned matcher
 * function also takes a boolean as the second argument that, when true,
 * returns an object with additional information.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch(glob[, options]);
 *
 * const isMatch = picomatch('*.!(*a)');
 * console.log(isMatch('a.a')); //=> false
 * console.log(isMatch('a.b')); //=> true
 * ```
 * @name picomatch
 * @param {String|Array} `globs` One or more glob patterns.
 * @param {Object=} `options`
 * @return {Function=} Returns a matcher function.
 * @api public
 */

const picomatch = (glob, options, returnState = false) => {
  if (Array.isArray(glob)) {
    const fns = glob.map(input => picomatch(input, options, returnState));
    const arrayMatcher = str => {
      for (const isMatch of fns) {
        const state = isMatch(str);
        if (state) return state;
      }
      return false;
    };
    return arrayMatcher;
  }

  const isState = isObject(glob) && glob.tokens && glob.input;

  if (glob === '' || (typeof glob !== 'string' && !isState)) {
    throw new TypeError('Expected pattern to be a non-empty string');
  }

  const opts = options || {};
  const posix = utils.isWindows(options);
  const regex = isState
    ? picomatch.compileRe(glob, options)
    : picomatch.makeRe(glob, options, false, true);

  const state = regex.state;
  delete regex.state;

  let isIgnored = () => false;
  if (opts.ignore) {
    const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
    isIgnored = picomatch(opts.ignore, ignoreOpts, returnState);
  }

  const matcher = (input, returnObject = false) => {
    const { isMatch, match, output } = picomatch.test(input, regex, options, { glob, posix });
    const result = { glob, state, regex, posix, input, output, match, isMatch };

    if (typeof opts.onResult === 'function') {
      opts.onResult(result);
    }

    if (isMatch === false) {
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (isIgnored(input)) {
      if (typeof opts.onIgnore === 'function') {
        opts.onIgnore(result);
      }
      result.isMatch = false;
      return returnObject ? result : false;
    }

    if (typeof opts.onMatch === 'function') {
      opts.onMatch(result);
    }
    return returnObject ? result : true;
  };

  if (returnState) {
    matcher.state = state;
  }

  return matcher;
};

/**
 * Test `input` with the given `regex`. This is used by the main
 * `picomatch()` function to test the input string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.test(input, regex[, options]);
 *
 * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
 * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp} `regex`
 * @return {Object} Returns an object with matching info.
 * @api public
 */

picomatch.test = (input, regex, options, { glob, posix } = {}) => {
  if (typeof input !== 'string') {
    throw new TypeError('Expected input to be a string');
  }

  if (input === '') {
    return { isMatch: false, output: '' };
  }

  const opts = options || {};
  const format = opts.format || (posix ? utils.toPosixSlashes : null);
  let match = input === glob;
  let output = (match && format) ? format(input) : input;

  if (match === false) {
    output = format ? format(input) : input;
    match = output === glob;
  }

  if (match === false || opts.capture === true) {
    if (opts.matchBase === true || opts.basename === true) {
      match = picomatch.matchBase(input, regex, options, posix);
    } else {
      match = regex.exec(output);
    }
  }

  return { isMatch: Boolean(match), match, output };
};

/**
 * Match the basename of a filepath.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.matchBase(input, glob[, options]);
 * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
 * ```
 * @param {String} `input` String to test.
 * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
 * @return {Boolean}
 * @api public
 */

picomatch.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
  const regex = glob instanceof RegExp ? glob : picomatch.makeRe(glob, options);
  return regex.test(path.basename(input));
};

/**
 * Returns true if **any** of the given glob `patterns` match the specified `string`.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.isMatch(string, patterns[, options]);
 *
 * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
 * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
 * ```
 * @param {String|Array} str The string to test.
 * @param {String|Array} patterns One or more glob patterns to use for matching.
 * @param {Object} [options] See available [options](#options).
 * @return {Boolean} Returns true if any patterns match `str`
 * @api public
 */

picomatch.isMatch = (str, patterns, options) => picomatch(patterns, options)(str);

/**
 * Parse a glob pattern to create the source string for a regular
 * expression.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const result = picomatch.parse(pattern[, options]);
 * ```
 * @param {String} `pattern`
 * @param {Object} `options`
 * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
 * @api public
 */

picomatch.parse = (pattern, options) => {
  if (Array.isArray(pattern)) return pattern.map(p => picomatch.parse(p, options));
  return parse(pattern, { ...options, fastpaths: false });
};

/**
 * Scan a glob pattern to separate the pattern into segments.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.scan(input[, options]);
 *
 * const result = picomatch.scan('!./foo/*.js');
 * console.log(result);
 * { prefix: '!./',
 *   input: '!./foo/*.js',
 *   start: 3,
 *   base: 'foo',
 *   glob: '*.js',
 *   isBrace: false,
 *   isBracket: false,
 *   isGlob: true,
 *   isExtglob: false,
 *   isGlobstar: false,
 *   negated: true }
 * ```
 * @param {String} `input` Glob pattern to scan.
 * @param {Object} `options`
 * @return {Object} Returns an object with
 * @api public
 */

picomatch.scan = (input, options) => scan(input, options);

/**
 * Compile a regular expression from the `state` object returned by the
 * [parse()](#parse) method.
 *
 * @param {Object} `state`
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Intended for implementors, this argument allows you to return the raw output from the parser.
 * @param {Boolean} `returnState` Adds the state to a `state` property on the returned regex. Useful for implementors and debugging.
 * @return {RegExp}
 * @api public
 */

picomatch.compileRe = (state, options, returnOutput = false, returnState = false) => {
  if (returnOutput === true) {
    return state.output;
  }

  const opts = options || {};
  const prepend = opts.contains ? '' : '^';
  const append = opts.contains ? '' : '$';

  let source = `${prepend}(?:${state.output})${append}`;
  if (state && state.negated === true) {
    source = `^(?!${source}).*$`;
  }

  const regex = picomatch.toRegex(source, options);
  if (returnState === true) {
    regex.state = state;
  }

  return regex;
};

/**
 * Create a regular expression from a parsed glob pattern.
 *
 * ```js
 * const picomatch = require('picomatch');
 * const state = picomatch.parse('*.js');
 * // picomatch.compileRe(state[, options]);
 *
 * console.log(picomatch.compileRe(state));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `state` The object returned from the `.parse` method.
 * @param {Object} `options`
 * @param {Boolean} `returnOutput` Implementors may use this argument to return the compiled output, instead of a regular expression. This is not exposed on the options to prevent end-users from mutating the result.
 * @param {Boolean} `returnState` Implementors may use this argument to return the state from the parsed glob with the returned regular expression.
 * @return {RegExp} Returns a regex created from the given pattern.
 * @api public
 */

picomatch.makeRe = (input, options = {}, returnOutput = false, returnState = false) => {
  if (!input || typeof input !== 'string') {
    throw new TypeError('Expected a non-empty string');
  }

  let parsed = { negated: false, fastpaths: true };

  if (options.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
    parsed.output = parse.fastpaths(input, options);
  }

  if (!parsed.output) {
    parsed = parse(input, options);
  }

  return picomatch.compileRe(parsed, options, returnOutput, returnState);
};

/**
 * Create a regular expression from the given regex source string.
 *
 * ```js
 * const picomatch = require('picomatch');
 * // picomatch.toRegex(source[, options]);
 *
 * const { output } = picomatch.parse('*.js');
 * console.log(picomatch.toRegex(output));
 * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
 * ```
 * @param {String} `source` Regular expression source string.
 * @param {Object} `options`
 * @return {RegExp}
 * @api public
 */

picomatch.toRegex = (source, options) => {
  try {
    const opts = options || {};
    return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
  } catch (err) {
    if (options && options.debug === true) throw err;
    return /$^/;
  }
};

/**
 * Picomatch constants.
 * @return {Object}
 */

picomatch.constants = constants;

/**
 * Expose "picomatch"
 */

module.exports = picomatch;


/***/ }),

/***/ 2429:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


const utils = __nccwpck_require__(479);
const {
  CHAR_ASTERISK,             /* * */
  CHAR_AT,                   /* @ */
  CHAR_BACKWARD_SLASH,       /* \ */
  CHAR_COMMA,                /* , */
  CHAR_DOT,                  /* . */
  CHAR_EXCLAMATION_MARK,     /* ! */
  CHAR_FORWARD_SLASH,        /* / */
  CHAR_LEFT_CURLY_BRACE,     /* { */
  CHAR_LEFT_PARENTHESES,     /* ( */
  CHAR_LEFT_SQUARE_BRACKET,  /* [ */
  CHAR_PLUS,                 /* + */
  CHAR_QUESTION_MARK,        /* ? */
  CHAR_RIGHT_CURLY_BRACE,    /* } */
  CHAR_RIGHT_PARENTHESES,    /* ) */
  CHAR_RIGHT_SQUARE_BRACKET  /* ] */
} = __nccwpck_require__(6099);

const isPathSeparator = code => {
  return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
};

const depth = token => {
  if (token.isPrefix !== true) {
    token.depth = token.isGlobstar ? Infinity : 1;
  }
};

/**
 * Quickly scans a glob pattern and returns an object with a handful of
 * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
 * `glob` (the actual pattern), `negated` (true if the path starts with `!` but not
 * with `!(`) and `negatedExtglob` (true if the path starts with `!(`).
 *
 * ```js
 * const pm = require('picomatch');
 * console.log(pm.scan('foo/bar/*.js'));
 * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
 * ```
 * @param {String} `str`
 * @param {Object} `options`
 * @return {Object} Returns an object with tokens and regex source string.
 * @api public
 */

const scan = (input, options) => {
  const opts = options || {};

  const length = input.length - 1;
  const scanToEnd = opts.parts === true || opts.scanToEnd === true;
  const slashes = [];
  const tokens = [];
  const parts = [];

  let str = input;
  let index = -1;
  let start = 0;
  let lastIndex = 0;
  let isBrace = false;
  let isBracket = false;
  let isGlob = false;
  let isExtglob = false;
  let isGlobstar = false;
  let braceEscaped = false;
  let backslashes = false;
  let negated = false;
  let negatedExtglob = false;
  let finished = false;
  let braces = 0;
  let prev;
  let code;
  let token = { value: '', depth: 0, isGlob: false };

  const eos = () => index >= length;
  const peek = () => str.charCodeAt(index + 1);
  const advance = () => {
    prev = code;
    return str.charCodeAt(++index);
  };

  while (index < length) {
    code = advance();
    let next;

    if (code === CHAR_BACKWARD_SLASH) {
      backslashes = token.backslashes = true;
      code = advance();

      if (code === CHAR_LEFT_CURLY_BRACE) {
        braceEscaped = true;
      }
      continue;
    }

    if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
      braces++;

      while (eos() !== true && (code = advance())) {
        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (code === CHAR_LEFT_CURLY_BRACE) {
          braces++;
          continue;
        }

        if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (braceEscaped !== true && code === CHAR_COMMA) {
          isBrace = token.isBrace = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_RIGHT_CURLY_BRACE) {
          braces--;

          if (braces === 0) {
            braceEscaped = false;
            isBrace = token.isBrace = true;
            finished = true;
            break;
          }
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (code === CHAR_FORWARD_SLASH) {
      slashes.push(index);
      tokens.push(token);
      token = { value: '', depth: 0, isGlob: false };

      if (finished === true) continue;
      if (prev === CHAR_DOT && index === (start + 1)) {
        start += 2;
        continue;
      }

      lastIndex = index + 1;
      continue;
    }

    if (opts.noext !== true) {
      const isExtglobChar = code === CHAR_PLUS
        || code === CHAR_AT
        || code === CHAR_ASTERISK
        || code === CHAR_QUESTION_MARK
        || code === CHAR_EXCLAMATION_MARK;

      if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
        isGlob = token.isGlob = true;
        isExtglob = token.isExtglob = true;
        finished = true;
        if (code === CHAR_EXCLAMATION_MARK && index === start) {
          negatedExtglob = true;
        }

        if (scanToEnd === true) {
          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              code = advance();
              continue;
            }

            if (code === CHAR_RIGHT_PARENTHESES) {
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }
          continue;
        }
        break;
      }
    }

    if (code === CHAR_ASTERISK) {
      if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_QUESTION_MARK) {
      isGlob = token.isGlob = true;
      finished = true;

      if (scanToEnd === true) {
        continue;
      }
      break;
    }

    if (code === CHAR_LEFT_SQUARE_BRACKET) {
      while (eos() !== true && (next = advance())) {
        if (next === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          advance();
          continue;
        }

        if (next === CHAR_RIGHT_SQUARE_BRACKET) {
          isBracket = token.isBracket = true;
          isGlob = token.isGlob = true;
          finished = true;
          break;
        }
      }

      if (scanToEnd === true) {
        continue;
      }

      break;
    }

    if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
      negated = token.negated = true;
      start++;
      continue;
    }

    if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
      isGlob = token.isGlob = true;

      if (scanToEnd === true) {
        while (eos() !== true && (code = advance())) {
          if (code === CHAR_LEFT_PARENTHESES) {
            backslashes = token.backslashes = true;
            code = advance();
            continue;
          }

          if (code === CHAR_RIGHT_PARENTHESES) {
            finished = true;
            break;
          }
        }
        continue;
      }
      break;
    }

    if (isGlob === true) {
      finished = true;

      if (scanToEnd === true) {
        continue;
      }

      break;
    }
  }

  if (opts.noext === true) {
    isExtglob = false;
    isGlob = false;
  }

  let base = str;
  let prefix = '';
  let glob = '';

  if (start > 0) {
    prefix = str.slice(0, start);
    str = str.slice(start);
    lastIndex -= start;
  }

  if (base && isGlob === true && lastIndex > 0) {
    base = str.slice(0, lastIndex);
    glob = str.slice(lastIndex);
  } else if (isGlob === true) {
    base = '';
    glob = str;
  } else {
    base = str;
  }

  if (base && base !== '' && base !== '/' && base !== str) {
    if (isPathSeparator(base.charCodeAt(base.length - 1))) {
      base = base.slice(0, -1);
    }
  }

  if (opts.unescape === true) {
    if (glob) glob = utils.removeBackslashes(glob);

    if (base && backslashes === true) {
      base = utils.removeBackslashes(base);
    }
  }

  const state = {
    prefix,
    input,
    start,
    base,
    glob,
    isBrace,
    isBracket,
    isGlob,
    isExtglob,
    isGlobstar,
    negated,
    negatedExtglob
  };

  if (opts.tokens === true) {
    state.maxDepth = 0;
    if (!isPathSeparator(code)) {
      tokens.push(token);
    }
    state.tokens = tokens;
  }

  if (opts.parts === true || opts.tokens === true) {
    let prevIndex;

    for (let idx = 0; idx < slashes.length; idx++) {
      const n = prevIndex ? prevIndex + 1 : start;
      const i = slashes[idx];
      const value = input.slice(n, i);
      if (opts.tokens) {
        if (idx === 0 && start !== 0) {
          tokens[idx].isPrefix = true;
          tokens[idx].value = prefix;
        } else {
          tokens[idx].value = value;
        }
        depth(tokens[idx]);
        state.maxDepth += tokens[idx].depth;
      }
      if (idx !== 0 || value !== '') {
        parts.push(value);
      }
      prevIndex = i;
    }

    if (prevIndex && prevIndex + 1 < input.length) {
      const value = input.slice(prevIndex + 1);
      parts.push(value);

      if (opts.tokens) {
        tokens[tokens.length - 1].value = value;
        depth(tokens[tokens.length - 1]);
        state.maxDepth += tokens[tokens.length - 1].depth;
      }
    }

    state.slashes = slashes;
    state.parts = parts;
  }

  return state;
};

module.exports = scan;


/***/ }),

/***/ 479:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


const path = __nccwpck_require__(1017);
const win32 = process.platform === 'win32';
const {
  REGEX_BACKSLASH,
  REGEX_REMOVE_BACKSLASH,
  REGEX_SPECIAL_CHARS,
  REGEX_SPECIAL_CHARS_GLOBAL
} = __nccwpck_require__(6099);

exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

exports.removeBackslashes = str => {
  return str.replace(REGEX_REMOVE_BACKSLASH, match => {
    return match === '\\' ? '' : match;
  });
};

exports.supportsLookbehinds = () => {
  const segs = process.version.slice(1).split('.').map(Number);
  if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
    return true;
  }
  return false;
};

exports.isWindows = options => {
  if (options && typeof options.windows === 'boolean') {
    return options.windows;
  }
  return win32 === true || path.sep === '\\';
};

exports.escapeLast = (input, char, lastIdx) => {
  const idx = input.lastIndexOf(char, lastIdx);
  if (idx === -1) return input;
  if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
  return `${input.slice(0, idx)}\\${input.slice(idx)}`;
};

exports.removePrefix = (input, state = {}) => {
  let output = input;
  if (output.startsWith('./')) {
    output = output.slice(2);
    state.prefix = './';
  }
  return output;
};

exports.wrapOutput = (input, state = {}, options = {}) => {
  const prepend = options.contains ? '' : '^';
  const append = options.contains ? '' : '$';

  let output = `${prepend}(?:${input})${append}`;
  if (state.negated === true) {
    output = `(?:^(?!${output}).*$)`;
  }
  return output;
};


/***/ }),

/***/ 2484:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlError = void 0;
class CurlError extends Error {
    constructor(code, message) {
        super(message);
        if (code < 1 || code > 99) {
            throw new Error(`
        CurlError code must be between 1 and 99. Given: ${code}.
        
        Please take a look at the resource below for valid Libcurl errors:
          - https://curl.se/libcurl/c/libcurl-errors.html
      `);
        }
        this.code = code;
        Object.setPrototypeOf(this, CurlError.prototype);
    }
}
exports.CurlError = CurlError;
//# sourceMappingURL=errors.js.map

/***/ }),

/***/ 9611:
/***/ (function(module, exports, __nccwpck_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurlError = void 0;
const request_1 = __importDefault(__nccwpck_require__(3693));
const errors_1 = __nccwpck_require__(2484);
Object.defineProperty(exports, "CurlError", ({ enumerable: true, get: function () { return errors_1.CurlError; } }));
exports["default"] = request_1.default;
// CommonJS (CJS)
module.exports = request_1.default;
module.exports["default"] = request_1.default;
module.exports.CurlError = errors_1.CurlError;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 3693:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const easy_libcurl_1 = __nccwpck_require__(9799);
const utils_1 = __nccwpck_require__(4280);
/**
 * Create a libcurl Easy object with default configurations
 *
 * @param {HttpVerb} method - The HTTP method (e.g., 'GET', 'POST', 'PUT')
 * @param {Options} options - configuration options for the request.
 * @returns {Easy} an initialized libcurl Easy object with default options
 */
const createCurlObjectWithDefaults = (method, options) => {
    var _a, _b;
    const curl = new easy_libcurl_1.Easy();
    curl.setOpt(easy_libcurl_1.Curl.option.CUSTOMREQUEST, method);
    curl.setOpt(easy_libcurl_1.Curl.option.TIMEOUT_MS, (_a = options.timeout) !== null && _a !== void 0 ? _a : 0);
    curl.setOpt(easy_libcurl_1.Curl.option.FOLLOWLOCATION, options.followRedirects === undefined ||
        options.followRedirects);
    curl.setOpt(easy_libcurl_1.Curl.option.MAXREDIRS, (_b = options.maxRedirects) !== null && _b !== void 0 ? _b : -1);
    curl.setOpt(easy_libcurl_1.Curl.option.SSL_VERIFYPEER, !options.insecure);
    curl.setOpt(easy_libcurl_1.Curl.option.NOBODY, method === 'HEAD');
    return curl;
};
/**
 * Handles query string parameters in a URL, modifies the URL if necessary,
 * and sets it as the CURLOPT_URL option in the given cURL Easy object.
 *
 * @param {Easy} curl - The cURL easy handle
 * @param {string} url - The URL to handle query string parameters for
 * @param {Object.<string, any>} qs - query string parameters for the request
 */
const handleQueryString = (curl, url, qs) => {
    url = qs && Object.keys(qs).length ? (0, utils_1.handleQs)(url, qs) : url;
    curl.setOpt(easy_libcurl_1.Curl.option.URL, url);
};
/**
 * Sets up a callback function for the cURL Easy object to handle returned
 * headers and populate the input array with header lines.
 *
 * @param {Easy} curl - The cURL easy handle
 * @param {string[]} returnedHeaderArray - array for returned header lines
 */
const handleOutgoingHeaders = (curl, returnedHeaderArray) => {
    curl.setOpt(easy_libcurl_1.Curl.option.HEADERFUNCTION, (headerLine) => {
        returnedHeaderArray.push(headerLine.toString('utf-8').trim());
        return headerLine.length;
    });
};
/**
 * Sets the JSON payload for the curl request.
 * @param {Easy} curl - The curl object.
 * @param {any} json - The JSON body to be sent
 * @param {string[]} httpHeaders - HTTP headers for the request
 */
const setJSONPayload = (curl, json, httpHeaders) => {
    httpHeaders.push('Content-Type: application/json');
    const payload = JSON.stringify(json);
    httpHeaders.push(`Content-Length: ${Buffer.byteLength(payload, 'utf-8')}`);
    curl.setOpt(easy_libcurl_1.Curl.option.POSTFIELDS, payload);
};
/**
 * Sets the buffer payload for the curl request.
 * @param {Easy} curl - The curl object.
 * @param {string | Buffer} body - The body to be sent in the request.
 * @param {string[]} httpHeaders - HTTP headers for the request
 */
const setBodyPayload = (curl, body, httpHeaders) => {
    if (Buffer.isBuffer(body)) {
        let position = 0;
        curl.setOpt(easy_libcurl_1.Curl.option.POST, true);
        curl.setOpt(easy_libcurl_1.Curl.option.POSTFIELDSIZE, -1);
        curl.setOpt(easy_libcurl_1.Curl.option.READFUNCTION, (buffer, size, nmemb) => {
            const amountToRead = size * nmemb;
            if (position === body.length) {
                return 0;
            }
            const totalWritten = body.copy(buffer, 0, position, Math.min(amountToRead, body.length));
            position += totalWritten;
            return totalWritten;
        });
    }
    else {
        curl.setOpt(easy_libcurl_1.Curl.option.POSTFIELDS, body);
        httpHeaders.push(`Content-Length: ${Buffer.byteLength(body, 'utf-8')}`);
    }
};
/**
 * Prepares the request body and headers for a cURL request based on provided
 * options. Also sets up a callback function for the cURL Easy object to handle
 * returned body and populates the input buffet.
 *
 * @param {Easy} curl - The cURL easy handle
 * @param {Options} options - Options for configuring the request
 * @param {{ body: Buffer }} buffer - wrapped buffer for the returned body
 * @param {string[]} httpHeaders - HTTP headers for the request
 */
const handleBodyAndRequestHeaders = (curl, options, buffer, httpHeaders) => {
    if (options.json) {
        setJSONPayload(curl, options.json, httpHeaders);
    }
    else if (options.body) {
        setBodyPayload(curl, options.body, httpHeaders);
    }
    else {
        httpHeaders.push('Content-Length: 0');
    }
    curl.setOpt(easy_libcurl_1.Curl.option.WRITEFUNCTION, (buff, nmemb, size) => {
        buffer.body = Buffer.concat([buffer.body, buff.subarray(0, nmemb * size)]);
        return nmemb * size;
    });
    curl.setOpt(easy_libcurl_1.Curl.option.HTTPHEADER, httpHeaders);
};
/**
 * Performs an HTTP request using cURL with the specified parameters.
 *
 * @param {HttpVerb} method - The HTTP method for the request (e.g., 'GET', 'POST')
 * @param {string} url - The URL to make the request to
 * @param {Options} [options={}] - An object to configure the request
 * @returns {Response} - HTTP response consisting of status code, headers, and body
 */
const request = (method, url, options = {}) => {
    const curl = createCurlObjectWithDefaults(method, options);
    handleQueryString(curl, url, options.qs);
    // Body/JSON and Headers (incoming)
    const bufferWrap = { body: Buffer.alloc(0) };
    handleBodyAndRequestHeaders(curl, options, bufferWrap, (0, utils_1.parseIncomingHeaders)(options.headers));
    // Headers (outgoing)
    const returnedHeaderArray = [];
    handleOutgoingHeaders(curl, returnedHeaderArray);
    if (options.setEasyOptions) {
        options.setEasyOptions(curl, easy_libcurl_1.Curl.option);
    }
    // Execute request
    const code = curl.perform();
    (0, utils_1.checkValidCurlCode)(code, { method, url, options });
    // Creating return object
    const statusCode = curl.getInfo('RESPONSE_CODE').data;
    const headers = (0, utils_1.parseReturnedHeaders)(returnedHeaderArray);
    const { body } = bufferWrap;
    /**
     * Get the body of a response with an optional encoding.
     *
     * @throws {Error} if the status code is >= 300
     * @returns {Buffer | string} buffer body by default, string body with encoding
     */
    const getBody = (encoding) => {
        (0, utils_1.checkGetBodyStatus)(statusCode, body);
        return typeof encoding === 'string' ? body.toString(encoding) : body;
    };
    url = curl.getInfo('EFFECTIVE_URL').data;
    curl.close();
    return { statusCode, headers, body, getBody, url };
};
exports["default"] = request;
//# sourceMappingURL=request.js.map

/***/ }),

/***/ 4280:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkGetBodyStatus = exports.checkValidCurlCode = exports.parseReturnedHeaders = exports.parseIncomingHeaders = exports.handleQs = void 0;
const easy_libcurl_1 = __nccwpck_require__(9799);
const errors_1 = __nccwpck_require__(2484);
/**
 * Handles query string parameters in a URL by modifying or appending them
 * based on the provided object.
 *
 * Arrays of primitives, e.g. { quizIds: [1,2,3] }, will be of the form:
 *   https://google.com.au/?quizIds%5B0%5D=0&quizIds%5B1%5D=1&quizIds%5B2%5D=2
 *   i.e. https://www.google.com.au/?quizIds[0]=0&quizIds[1]=1&quizIds[2]=2
 *
 * @param {string} url - The URL to handle query string parameters for.
 * @param {Object.<string, any>} qs - query string parameters to modify or append.
 * @returns {string} The modified URL with the updated query string parameters.
 */
const handleQs = (url, qs) => {
    const urlObj = new URL(url);
    for (const [key, value] of Object.entries(qs)) {
        if (Array.isArray(value)) {
            urlObj.searchParams.delete(key);
            value.forEach((item, i) => urlObj.searchParams.append(`${key}[${i}]`, String(item)));
        }
        else if (value === null) {
            urlObj.searchParams.set(key, '');
        }
        else if (value !== undefined) {
            urlObj.searchParams.set(key, String(value));
        }
    }
    urlObj.search = urlObj.searchParams.toString();
    return urlObj.href;
};
exports.handleQs = handleQs;
/**
 * Parses incoming HTTP headers to an array of formatted strings.
 *
 * @param {IncomingHttpHeaders} headers - The header object to parse.
 * @returns {string[]} An array of formatted header strings.
 */
const parseIncomingHeaders = (headers) => {
    return headers
        ? Object.entries(headers)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => value === '' ? `${key};` : `${key}: ${value}`)
        : [];
};
exports.parseIncomingHeaders = parseIncomingHeaders;
/**
 * Parses an array of header lines as IncomingHttpHeaders.
 *
 * @param {string[]} headerLines - An array of header lines to parse.
 * @returns {IncomingHttpHeaders} An object containing parsed headers.
 */
const parseReturnedHeaders = (headerLines) => {
    return headerLines.reduce((acc, header) => {
        const [name, ...values] = header.split(':');
        if (name && values.length > 0) {
            acc[name.trim().toLowerCase()] = values.join(':').trim();
        }
        return acc;
    }, {});
};
exports.parseReturnedHeaders = parseReturnedHeaders;
/**
 * Checks CURL code and throws a `CurlError` if it indicates failure.
 *
 * @param {CurlCode} code - The CURL error code to check.
 * @param {RequestInputs} requestInputs - input parameters for the CURL request.
 * @throws {CurlError} Throws a `CurlError` if the CURL code indicates failure.
 */
const checkValidCurlCode = (code, requestInputs) => {
    if (code !== easy_libcurl_1.CurlCode.CURLE_OK) {
        throw new errors_1.CurlError(code, `
      Curl request failed with code ${code}:
        - ${easy_libcurl_1.Easy.strError(code)}

      You can also look up the Libcurl Error (code ${code}) here:
        - https://curl.se/libcurl/c/libcurl-errors.html

      DEBUG: {
        method: "${requestInputs.method}",
        url: "${requestInputs.url}",
        options: ${JSON.stringify(requestInputs.options)}
      }
    `);
    }
};
exports.checkValidCurlCode = checkValidCurlCode;
/**
 * Checks the status code and body of an HTTP response
 *
 * @param {number} statusCode - The status code of the HTTP response.
 * @param {Buffer} body - The body of the HTTP response.
 * @throws {Error} if the status code is >= 300.
 */
const checkGetBodyStatus = (statusCode, body) => {
    if (statusCode >= 300) {
        throw new Error(`
      Server responded with status code ${statusCode}

      Body: ${body.toString()}

      Use 'res.body' instead of 'res.getBody()' to not have any errors thrown.
      The status code (in this case, ${statusCode}) can be checked manually
      with res.statusCode.
    `);
    }
};
exports.checkGetBodyStatus = checkGetBodyStatus;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 9679:
/***/ ((module) => {

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global global, define, Symbol, Reflect, Promise, SuppressedError */
var __extends;
var __assign;
var __rest;
var __decorate;
var __param;
var __esDecorate;
var __runInitializers;
var __propKey;
var __setFunctionName;
var __metadata;
var __awaiter;
var __generator;
var __exportStar;
var __values;
var __read;
var __spread;
var __spreadArrays;
var __spreadArray;
var __await;
var __asyncGenerator;
var __asyncDelegator;
var __asyncValues;
var __makeTemplateObject;
var __importStar;
var __importDefault;
var __classPrivateFieldGet;
var __classPrivateFieldSet;
var __classPrivateFieldIn;
var __createBinding;
var __addDisposableResource;
var __disposeResources;
(function (factory) {
    var root = typeof global === "object" ? global : typeof self === "object" ? self : typeof this === "object" ? this : {};
    if (typeof define === "function" && define.amd) {
        define("tslib", ["exports"], function (exports) { factory(createExporter(root, createExporter(exports))); });
    }
    else if ( true && typeof module.exports === "object") {
        factory(createExporter(root, createExporter(module.exports)));
    }
    else {
        factory(createExporter(root));
    }
    function createExporter(exports, previous) {
        if (exports !== root) {
            if (typeof Object.create === "function") {
                Object.defineProperty(exports, "__esModule", { value: true });
            }
            else {
                exports.__esModule = true;
            }
        }
        return function (id, v) { return exports[id] = previous ? previous(id, v) : v; };
    }
})
(function (exporter) {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };

    __extends = function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };

    __assign = Object.assign || function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };

    __rest = function (s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    };

    __decorate = function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };

    __param = function (paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); }
    };

    __esDecorate = function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
        function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
        var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
        var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
        var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
        var _, done = false;
        for (var i = decorators.length - 1; i >= 0; i--) {
            var context = {};
            for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
            for (var p in contextIn.access) context.access[p] = contextIn.access[p];
            context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
            var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
            if (kind === "accessor") {
                if (result === void 0) continue;
                if (result === null || typeof result !== "object") throw new TypeError("Object expected");
                if (_ = accept(result.get)) descriptor.get = _;
                if (_ = accept(result.set)) descriptor.set = _;
                if (_ = accept(result.init)) initializers.unshift(_);
            }
            else if (_ = accept(result)) {
                if (kind === "field") initializers.unshift(_);
                else descriptor[key] = _;
            }
        }
        if (target) Object.defineProperty(target, contextIn.name, descriptor);
        done = true;
    };

    __runInitializers = function (thisArg, initializers, value) {
        var useValue = arguments.length > 2;
        for (var i = 0; i < initializers.length; i++) {
            value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
        }
        return useValue ? value : void 0;
    };

    __propKey = function (x) {
        return typeof x === "symbol" ? x : "".concat(x);
    };

    __setFunctionName = function (f, name, prefix) {
        if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
        return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
    };

    __metadata = function (metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
    };

    __awaiter = function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };

    __generator = function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };

    __exportStar = function(m, o) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
    };

    __createBinding = Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
            desc = { enumerable: true, get: function() { return m[k]; } };
        }
        Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    });

    __values = function (o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m) return m.call(o);
        if (o && typeof o.length === "number") return {
            next: function () {
                if (o && i >= o.length) o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    };

    __read = function (o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m) return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
        }
        catch (error) { e = { error: error }; }
        finally {
            try {
                if (r && !r.done && (m = i["return"])) m.call(i);
            }
            finally { if (e) throw e.error; }
        }
        return ar;
    };

    /** @deprecated */
    __spread = function () {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    };

    /** @deprecated */
    __spreadArrays = function () {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    };

    __spreadArray = function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };

    __await = function (v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    };

    __asyncGenerator = function (thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
    };

    __asyncDelegator = function (o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
    };

    __asyncValues = function (o) {
        if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
    };

    __makeTemplateObject = function (cooked, raw) {
        if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
        return cooked;
    };

    var __setModuleDefault = Object.create ? (function(o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
        o["default"] = v;
    };

    __importStar = function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };

    __importDefault = function (mod) {
        return (mod && mod.__esModule) ? mod : { "default": mod };
    };

    __classPrivateFieldGet = function (receiver, state, kind, f) {
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
        return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };

    __classPrivateFieldSet = function (receiver, state, value, kind, f) {
        if (kind === "m") throw new TypeError("Private method is not writable");
        if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
        if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
        return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
    };

    __classPrivateFieldIn = function (state, receiver) {
        if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
        return typeof state === "function" ? receiver === state : state.has(receiver);
    };

    __addDisposableResource = function (env, value, async) {
        if (value !== null && value !== void 0) {
            if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
            var dispose;
            if (async) {
                if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
                dispose = value[Symbol.asyncDispose];
            }
            if (dispose === void 0) {
                if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
                dispose = value[Symbol.dispose];
            }
            if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
            env.stack.push({ value: value, dispose: dispose, async: async });
        }
        else if (async) {
            env.stack.push({ async: true });
        }
        return value;
    };

    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    __disposeResources = function (env) {
        function fail(e) {
            env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
            env.hasError = true;
        }
        function next() {
            while (env.stack.length) {
                var rec = env.stack.pop();
                try {
                    var result = rec.dispose && rec.dispose.call(rec.value);
                    if (rec.async) return Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
                }
                catch (e) {
                    fail(e);
                }
            }
            if (env.hasError) throw env.error;
        }
        return next();
    };

    exporter("__extends", __extends);
    exporter("__assign", __assign);
    exporter("__rest", __rest);
    exporter("__decorate", __decorate);
    exporter("__param", __param);
    exporter("__esDecorate", __esDecorate);
    exporter("__runInitializers", __runInitializers);
    exporter("__propKey", __propKey);
    exporter("__setFunctionName", __setFunctionName);
    exporter("__metadata", __metadata);
    exporter("__awaiter", __awaiter);
    exporter("__generator", __generator);
    exporter("__exportStar", __exportStar);
    exporter("__createBinding", __createBinding);
    exporter("__values", __values);
    exporter("__read", __read);
    exporter("__spread", __spread);
    exporter("__spreadArrays", __spreadArrays);
    exporter("__spreadArray", __spreadArray);
    exporter("__await", __await);
    exporter("__asyncGenerator", __asyncGenerator);
    exporter("__asyncDelegator", __asyncDelegator);
    exporter("__asyncValues", __asyncValues);
    exporter("__makeTemplateObject", __makeTemplateObject);
    exporter("__importStar", __importStar);
    exporter("__importDefault", __importDefault);
    exporter("__classPrivateFieldGet", __classPrivateFieldGet);
    exporter("__classPrivateFieldSet", __classPrivateFieldSet);
    exporter("__classPrivateFieldIn", __classPrivateFieldIn);
    exporter("__addDisposableResource", __addDisposableResource);
    exporter("__disposeResources", __disposeResources);
});


/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 1713:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

const core = __nccwpck_require__(2186)
const { wait } = __nccwpck_require__(1312)
const request = __nccwpck_require__(9611)
const anymatch = __nccwpck_require__(5575)

function run() {
  try {
    // request inputs
    const url = core.getInput('url', { required: true })
    const maxAttemptsString = core.getInput('max-attempts', { required: false })
    const maxAttempts = parseInt(maxAttemptsString)
    const retryDelayString = core.getInput('retry-delay', { required: false })
    const retryDelay = parseInt(retryDelayString)
    const followRedirect = core.getBooleanInput('follow-redirect')
    const headersString = core.getInput('headers', { required: false })
    const headers = headersString.length > 0 ? headersString.split(',') : []
    const basicAuth = core.getInput('basic-auth', { required: false })
    // expected response inputs
    const expectedHeaderString = core.getInput('expected-header')
    const expectedHeader =
      expectedHeaderString.length > 0 ? expectedHeaderString.split(',') : []
    const expectedStatusString = core.getInput('expected-status')
    const expectedStatus = expectedStatusString.split(',')
    const expectedBodyString = core.getInput('expected-body')
    const expectedBody =
      expectedBodyString.length > 0 ? expectedBodyString.split(',') : []

    const assertResponse = (actualStatus, actualData, actualHeader) => {
      core.setOutput('actual-status', actualStatus)
      core.setOutput('actual-header', actualHeader)
      core.setOutput('actual-data', actualData)

      // Assert status code
      if (expectedStatus.includes(actualStatus.toString())) {
        core.setOutput('assert-status', true)
      } else {
        core.setOutput('assert-status', false)
        return false
      }

      // Assert header
      for (const eHeader in expectedHeader) {
        const eHeaderKey = expectedHeader[eHeader].split(':')[0]
        let eHeaderValue = expectedHeader[eHeader].split(':')[1]
        const compare = eHeaderValue.split('_')[0]
        eHeaderValue = eHeaderValue.replace(compare.concat('_'), '')

        // e(exist), ne(not exist)
        if (compare === 'e') {
          if (Object.keys(actualHeader).includes(eHeaderKey)) {
            core.setOutput('assert-header', true)
          } else {
            core.setOutput('assert-header', false)
            return false
          }
        }

        if (compare === 'ne') {
          if (!Object.keys(actualHeader).includes(eHeaderKey)) {
            core.setOutput('assert-header', true)
          } else {
            core.setOutput('assert-header', false)
            return false
          }
        }

        // c(contains), r(regex match), nc(not contains), nr(not regex match)
        for (const aHeaderKey in actualHeader) {
          const aHeaderValue = actualHeader[aHeaderKey]
          if (eHeaderKey !== aHeaderKey) {
            continue
          }

          if (compare === 'c') {
            if (aHeaderValue.includes(eHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'nc') {
            if (!aHeaderValue.includes(eHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'r') {
            if (anymatch(eHeaderValue, aHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }

          if (compare === 'nr') {
            if (!anymatch(eHeaderValue, aHeaderValue)) {
              core.setOutput('assert-header', true)
            } else {
              core.setOutput('assert-header', false)
              return false
            }
          }
        }
      }

      // Assert body data
      const responseData = actualData
      try {
        if (typeof responseData === 'object' && responseData !== null) {
          for (const eBody in expectedBody) {
            const eBodyKey = expectedBody[eBody].split(':')[0]
            let eBodyValue = expectedBody[eBody].split(':')[1]
            const compare = eBodyValue.split('_')[0]
            eBodyValue = eBodyValue.replace(compare.concat('_'), '')

            let targetValue = responseData
            let isKeyExist = true
            if (Object.prototype.hasOwnProperty.call(targetValue, eBodyKey)) {
              targetValue = targetValue[eBodyKey]
            } else {
              isKeyExist = false
            }

            // e(exist), ne(not exist)
            if (compare === 'e') {
              if (isKeyExist) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }
            if (compare === 'ne') {
              if (!isKeyExist) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            // c(contains), r(regex match), nc(not contains), nr(not regex match)
            if (compare === 'c') {
              if (targetValue.includes(eBodyValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'nc') {
              if (!targetValue.includes(eBodyValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'r') {
              if (anymatch(eBodyValue, targetValue)) {
                core.setOutput('assert-body', true)
                continue
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }

            if (compare === 'nr') {
              if (!anymatch(eBodyValue, targetValue)) {
                core.setOutput('assert-body', true)
              } else {
                core.setOutput('assert-body', false)
                return false
              }
            }
          }
        } else {
          core.setOutput('assert-body', false)
          return false
        }
      } catch (error) {
        core.setOutput('assert-body', false)
        return false
      }

      return true
    }
    for (let i = 0; i < maxAttempts; i++) {
      const res = request('GET', url, {
        setEasyOptions: (curl, options) => {
          curl.setOpt(options.FOLLOWLOCATION, followRedirect)
          if (headers.length > 0) {
            curl.setOpt(options.HTTPHEADER, headers)
          }
          if (basicAuth.length > 0) {
            curl.setOpt(options.USERPWD, basicAuth)
          }
        }
      })

      const isSuccess = assertResponse(
        res.statusCode,
        JSON.parse(res.body.toString()),
        res.headers
      )

      if (isSuccess) {
        return
      } else {
        wait(retryDelay)
      }
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    core.setFailed(error.message)
  }
  core.setFailed()
}

module.exports = {
  run
}


/***/ }),

/***/ 1312:
/***/ ((module) => {

function wait(milliseconds) {
  setTimeout(() => console.log('done!'), milliseconds)
}

module.exports = { wait }


/***/ }),

/***/ 720:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = require(__nccwpck_require__.ab + "lib/binding/node_libcurl.node")

/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 2781:
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ 1576:
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 7357:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"easy-libcurl","version":"2.0.1","description":"Fork of JCMais/node-libcurl - exposes only Easy interface, clean distributable, up-to-date and minimal dependencies.","keywords":["curl","http","https","easy","libcurl","node-curl","easy-libcurl","node-libcurl","request","sync-request","sync-request-curl","comp1531"],"homepage":"https://github.com/nktnet1/easy-libcurl","bugs":{"url":"https://github.com/nktnet1/easy-libcurl/issues"},"repository":{"type":"git","url":"git://github.com/nktnet1/easy-libcurl.git"},"license":"MIT","author":"Khiet Tam Nguyen","main":"./dist/index.js","types":"./dist/index.d.ts","files":["binding.gyp","dist","scripts","src"],"binary":{"module_name":"node_libcurl","module_path":"./lib/binding/","remote_path":"./v4.0.0/","package_name":"{module_name}-v4.0.0-{node_abi}-{platform}-{arch}-{libc}.tar.gz","host":"https://github.com/JCMais/node-libcurl/releases/download"},"scripts":{"install":"node-pre-gyp install --fallback-to-build","cy":"rm -rf ./lib/binding ./build ./dist ./node_modules ./tsconfig.tsbuildinfo ./yarn.lock && yarn","prepublish":"tsc"},"dependencies":{"@mapbox/node-pre-gyp":"1.0.11","nan":"^2.18.0","node-gyp":"10.0.1","tslib":"^2.6.2"},"devDependencies":{"@types/node":"^20.11.17","ts-node":"^10.9.2","typescript":"^5.3.3"},"engines":{"node":">=16.14"}}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * The entrypoint for the action.
 */
const { run } = __nccwpck_require__(1713)

run()

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map