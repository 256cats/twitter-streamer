"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("../common/config");
var elastic_1 = require("../common/elastic");
function addTweet(tweet) {
    return elastic_1.client.index({
        index: config_1.default.elastic.index.name,
        id: tweet.id,
        type: config_1.default.elastic.index.type,
        body: tweet
    });
}
exports.addTweet = addTweet;
//# sourceMappingURL=dao.js.map