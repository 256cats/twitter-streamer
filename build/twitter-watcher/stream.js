"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Twitter = require("twitter");
var dao_1 = require("./dao");
var twitterStream = undefined;
var client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
function getLocations(streams) {
    return Object.keys(streams).map(function (id) {
        var _a = streams[id], top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right;
        return left + "," + bottom + "," + right + "," + top;
    }).join(',');
}
function restartStream(streams) {
    console.log('restartStreams', Object.keys(streams).length);
    if (Object.keys(streams).length > 0) {
        console.log('locations', getLocations(streams));
        var newStream = client.stream('statuses/filter', {
            locations: getLocations(streams)
        });
        newStream.on('data', function (event) {
            console.log('data', event && event.coordinates && event.text);
            if (event && event.text && event.coordinates) {
                event.timestamp_ms = parseInt(event.timestamp_ms, 10);
                dao_1.addTweet(event);
            }
        });
        newStream.on('error', function (error) {
            throw error;
        });
        if (typeof twitterStream !== 'undefined') {
            twitterStream.destroy();
        }
        twitterStream = newStream;
    }
    else {
        if (typeof twitterStream !== 'undefined') {
            twitterStream.destroy();
            twitterStream = undefined;
        }
    }
}
exports.restartStream = restartStream;
//# sourceMappingURL=stream.js.map