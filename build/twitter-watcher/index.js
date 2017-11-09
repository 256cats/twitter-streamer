"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
Object.defineProperty(exports, "__esModule", { value: true });
var redis_1 = require("../common/redis");
var config_1 = require("../common/config");
var serializer_1 = require("../common/serializer");
var stream_1 = require("./stream");
var lodash_1 = require("lodash");
var CLIENT_REFRESH_INTERVAL = 500;
process.on('uncaughtException', function (error) {
    console.log('uncaughtException', error);
    process.exit(1);
});
process.on('unhandledRejection', function (reason, error) {
    console.log('unhandledRejection', reason, error);
    process.exit(1);
});
var redisSub = redis_1.factory();
function getStreams() {
    return __awaiter(this, void 0, void 0, function () {
        var streams, setMembers;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    streams = {};
                    return [4 /*yield*/, redis_1.default.smembersAsync(config_1.default.redis.key.streams)];
                case 1:
                    setMembers = (_a.sent()) || [];
                    setMembers
                        .forEach(function (item) {
                        var stream = serializer_1.parse(item);
                        streams[item] = stream;
                    });
                    return [2 /*return*/, streams];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var streams;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getStreams()];
                case 1:
                    streams = _a.sent();
                    stream_1.restartStream(streams);
                    setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                        var newStreams, keys1, keys2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getStreams()];
                                case 1:
                                    newStreams = _a.sent();
                                    keys1 = Object.keys(streams);
                                    keys2 = Object.keys(newStreams);
                                    if (!lodash_1.isEqual(keys1, keys2)) {
                                        streams = newStreams;
                                        stream_1.restartStream(streams);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); }, CLIENT_REFRESH_INTERVAL);
                    return [2 /*return*/];
            }
        });
    });
}
main();
//# sourceMappingURL=index.js.map