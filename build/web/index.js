"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var http = require("http");
var socketio = require("socket.io");
var path_1 = require("path");
var lodash_1 = require("lodash");
var config_1 = require("../common/config");
var dao_1 = require("./dao");
var polling_1 = require("./polling");
var geo_1 = require("./geo");
var sanitize_1 = require("./sanitize");
var app = express();
var server = http.createServer(app);
var io = socketio(server);
server.listen(config_1.default.server.port, function () {
    console.log("Started " + config_1.default.server.port);
});
app.use(express.static(path_1.resolve(path_1.join(__dirname, '..', '..', 'public'))));
var clients = {};
io.on('connection', function (socket) {
    var _a = socket.handshake.query, lat = _a.lat, lon = _a.lon, radius = _a.radius, delay = _a.delay;
    console.log('new connection', socket.handshake.query);
    if (lodash_1.isNumber(sanitize_1.toNumber(lat))
        && lodash_1.isNumber(sanitize_1.toNumber(lon))
        && lodash_1.isNumber(sanitize_1.toNumber(radius))
        && lodash_1.isNumber(sanitize_1.toNumber(delay))) {
        try {
            var bbox = geo_1.coordinatesToBbox(sanitize_1.toNumber(lat), sanitize_1.toNumber(lon), sanitize_1.toNumber(radius));
            dao_1.addStream(bbox);
            clients[socket.id] = {
                bbox: bbox,
                distance: {
                    lat: sanitize_1.toNumber(lat),
                    lon: sanitize_1.toNumber(lon),
                    radius: sanitize_1.toNumber(radius)
                },
                delay: sanitize_1.toNumber(delay),
                socket: socket,
                tweets: []
            };
            socket.on('disconnect', function () {
                delete clients[socket.id];
            });
        }
        catch (e) {
            console.log('error', e);
        }
    }
});
polling_1.startPolling(clients);
//# sourceMappingURL=index.js.map