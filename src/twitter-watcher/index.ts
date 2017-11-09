import { uniq } from 'lodash'
import redis, { factory as redisFactory } from '../common/redis'
import config from '../common/config'
import { parse } from '../common/serializer'
import { IBBox } from '../common/interfaces.d'
import { restartStream, TStreams } from './stream'
import { isEqual } from 'lodash'
const CLIENT_REFRESH_INTERVAL = 500

process.on('uncaughtException', function(error) {
  console.log('uncaughtException', error)
  process.exit(1)
})

process.on('unhandledRejection', function(reason, error) {
  console.log('unhandledRejection', reason, error)
  process.exit(1)
})

const redisSub = redisFactory()
async function getStreams() {
  const streams: TStreams = {}
  const setMembers = (await redis.smembersAsync(config.redis.key.streams)) || []
  setMembers
    .forEach(item => { // restore streams on start
      const stream = parse(item)
      streams[item] = stream
    })
  return streams
}

async function main() {
  let streams: TStreams = await getStreams()
  restartStream(streams)
  setInterval(async () => {
    const newStreams = await getStreams()
    const keys1 = Object.keys(streams)
    const keys2 = Object.keys(newStreams)
    if (!isEqual(keys1, keys2)) {
      streams = newStreams
      restartStream(streams)
    }
  }, CLIENT_REFRESH_INTERVAL)
}

main()
