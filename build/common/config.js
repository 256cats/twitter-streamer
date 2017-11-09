"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path_1 = require("path");
var configPath = path_1.resolve(path_1.join(__dirname, '..', '..', 'config', 'default.json'));
exports.default = JSON.parse(fs.readFileSync(configPath, {
    encoding: 'utf8'
}));
//# sourceMappingURL=config.js.map