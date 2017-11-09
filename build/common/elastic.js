"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var elasticSearch = require("elasticsearch");
var config_1 = require("./config");
exports.client = new elasticSearch.Client({
    host: config_1.default.elastic.host,
    log: 'info'
});
//# sourceMappingURL=elastic.js.map