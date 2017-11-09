"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redis = require("redis");
var sb_promisify_1 = require("sb-promisify");
var config_1 = require("./config");
var RedisClient = redis.RedisClient.prototype;
var Multi = redis.Multi.prototype;
var RedisClientP = sb_promisify_1.promisifyAll(redis.RedisClient.prototype);
var MultiP = sb_promisify_1.promisifyAll(redis.Multi.prototype);
redis.RedisClient.prototype = Object.assign(RedisClient, RedisClientP);
redis.Multi.prototype = Object.assign(Multi, MultiP);
exports.factory = function () { return redis.createClient(config_1.default.redis); };
var redisSingleton = exports.factory();
exports.default = redisSingleton;
//# sourceMappingURL=redis.js.map