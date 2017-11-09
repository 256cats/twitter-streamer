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
var config_1 = require("../common/config");
var dao_1 = require("./dao");
var lodash_1 = require("lodash");
var ms = 1000;
var PRELOAD_THRESHOLD = 100;
var interval = undefined;
function loadTweets(client) {
    return __awaiter(this, void 0, void 0, function () {
        var ts;
        return __generator(this, function (_a) {
            ts = client.tweets.length > 0
                ? client.tweets[0].timestamp_ms
                : Date.now().valueOf() - client.delay * ms;
            return [2 /*return*/, dao_1.preload(client.distance, client.lastId, ts)];
        });
    });
}
function updateTweets(client, newTweets) {
    client.tweets = lodash_1.uniqBy(client.tweets.concat(newTweets), 'id');
    client.tweets.sort(function (a, b) { return a.timestamp_ms - b.timestamp_ms; });
}
function publishTweets(client) {
    var timestampMs = Date.now().valueOf() - client.delay * ms;
    var tweetsToPublish = [];
    if (client.tweets.length === 0) {
        return;
    }
    var tweetQueue = [];
    client.lastId = client.tweets[0].id;
    for (var idx = 0; idx < client.tweets.length; idx++) {
        var tweet = client.tweets[idx];
        console.log('publishTweets', idx, client.tweets.length);
        console.log('diff', timestampMs - tweet.timestamp_ms);
        if (tweet.timestamp_ms <= timestampMs) {
            tweetsToPublish.push(tweet);
        }
        else {
            tweetQueue.push(tweet);
        }
    }
    client.tweets = tweetQueue;
    if (tweetsToPublish.length > 0) {
        console.log('tweetsToPublish', tweetsToPublish.map(function (item) { return item.id; }));
        client.socket.emit('newTweets', tweetsToPublish);
    }
}
function poll(clients) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, id, client, newTweets;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, _a = Object.keys(clients);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 5];
                    id = _a[_i];
                    client = clients[id];
                    if (!(client.tweets.length <= PRELOAD_THRESHOLD)) return [3 /*break*/, 3];
                    return [4 /*yield*/, loadTweets(client)];
                case 2:
                    newTweets = _b.sent();
                    console.log('newTweets', newTweets.length);
                    updateTweets(client, newTweets);
                    _b.label = 3;
                case 3:
                    publishTweets(client);
                    _b.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 1];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function startPolling(clients) {
    interval = setInterval(function () { return poll(clients); }, config_1.default.server.pollingInterval);
}
exports.startPolling = startPolling;
function stopPolling() {
    clearInterval(interval);
    interval = undefined;
}
exports.stopPolling = stopPolling;
//# sourceMappingURL=polling.js.map