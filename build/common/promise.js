"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function delay(cb, timeout) {
    return new Promise(function (resolve) {
        setTimeout(function () { return resolve(cb()); }, timeout);
    });
}
exports.delay = delay;
//# sourceMappingURL=promise.js.map