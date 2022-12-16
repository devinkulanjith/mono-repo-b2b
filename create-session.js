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
var __generator = (this && this.__generator) || function (thisArg, body) {
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
exports.__esModule = true;
exports.createSession = exports.getAuthToken = void 0;
var fs_1 = require("fs");
var fs = require("fs/promises");
var os_1 = require("os");
var path = require("path");
var io = require("@actions/io");
var getAuthToken = function (_a) {
    var appkey = _a.appkey, apptoken = _a.apptoken, account = _a.account;
    return __awaiter(void 0, void 0, void 0, function () {
        var payload, fetch, res, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = {
                        appkey: appkey,
                        apptoken: apptoken
                    };
                    return [4 /*yield*/, Promise.resolve().then(function () { return require('node-fetch'); }).then(function (mod) { return mod["default"]; })];
                case 1:
                    fetch = _b.sent();
                    return [4 /*yield*/, fetch("http://api.vtexcommercestable.com.br/api/vtexid/apptoken/login?an=".concat(encodeURIComponent(account)), {
                            method: 'POST',
                            body: JSON.stringify(payload),
                            headers: { 'Content-Type': 'application/json' }
                        })];
                case 2:
                    res = _b.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    result = (_b.sent());
                    return [2 /*return*/, result.token];
            }
        });
    });
};
exports.getAuthToken = getAuthToken;
var createSession = function (token, account) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, session, workspace, sessionDirectory;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                tokens = (_a = {},
                    _a[account] = token,
                    _a);
                session = {
                    account: account,
                    login: 'login-bot@vtex.com.br',
                    token: token
                };
                workspace = {
                    currentWorkspace: 'master',
                    lastWorkspace: null
                };
                sessionDirectory = path.join((0, os_1.homedir)(), '.vtex', 'session');
                if (!!(0, fs_1.existsSync)(sessionDirectory)) return [3 /*break*/, 2];
                return [4 /*yield*/, io.mkdirP(sessionDirectory)];
            case 1:
                _b.sent();
                _b.label = 2;
            case 2: return [4 /*yield*/, Promise.all([
                    fs.writeFile(path.join(sessionDirectory, 'tokens.json'), JSON.stringify(tokens)),
                    fs.writeFile(path.join(sessionDirectory, 'session.json'), JSON.stringify(session)),
                    fs.writeFile(path.join(sessionDirectory, 'workspace.json'), JSON.stringify(workspace)),
                ])];
            case 3:
                _b.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.createSession = createSession;
