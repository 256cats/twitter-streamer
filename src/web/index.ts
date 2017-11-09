import * as express from 'express'
import * as http from 'http'
import * as socketio from 'socket.io'
import { join, resolve } from 'path'
import { isNumber } from 'lodash'
import config from '../common/config'
import { TClients } from './socket'
import { addStream, removeStream } from './dao'
import { startPolling } from './polling'
import { coordinatesToBbox } from './geo'
import { toNumber } from './sanitize'

const app = express()
const server = http.createServer(app)
const io = socketio(server)

server.listen(config.server.port, function() {
  console.log(`Started ${config.server.port}`)
})

app.use(express.static(resolve(join(__dirname, '..', '..', 'public'))))

const clients: TClients = {}

io.on('connection', function(socket) {
  const { lat, lon, radius, delay } = socket.handshake.query
  console.log('new connection', socket.handshake.query)
  if (isNumber(toNumber(lat))
      && isNumber(toNumber(lon))
      && isNumber(toNumber(radius))
      && isNumber(toNumber(delay))
  ) {
    try {
      const bbox = coordinatesToBbox(toNumber(lat), toNumber(lon), toNumber(radius))

      addStream(bbox)

      clients[socket.id] = {
        bbox,
        distance: {
          lat: toNumber(lat),
          lon: toNumber(lon),
          radius: toNumber(radius)
        },
        delay: toNumber(delay),
        socket,
        tweets: []
      }

      socket.on('disconnect', function() {
        delete clients[socket.id]
      })
    } catch (e) {
      console.log('error', e)
    }

  }

})

startPolling(clients)
