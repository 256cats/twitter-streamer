"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var turf = require("@turf/turf");
function coordinatesToBbox(lat, lon, radius) {
    var point = {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Point',
            coordinates: [lon, lat]
        }
    };
    var buffered = turf.buffer(point, radius, 'kilometers');
    var _a = turf.bbox(buffered), left = _a[0], bottom = _a[1], right = _a[2], top = _a[3];
    return {
        left: left,
        top: top,
        right: right,
        bottom: bottom
    };
}
exports.coordinatesToBbox = coordinatesToBbox;
//# sourceMappingURL=geo.js.map