import * as redis from 'redis'
import { promisifyAll } from 'sb-promisify'
import config from './config'

const RedisClient = redis.RedisClient.prototype
const Multi = redis.Multi.prototype
const RedisClientP = promisifyAll(redis.RedisClient.prototype)
const MultiP = promisifyAll(redis.Multi.prototype)

redis.RedisClient.prototype = Object.assign(RedisClient, RedisClientP)
redis.Multi.prototype = Object.assign(Multi, MultiP)

export const factory = () => redis.createClient(config.redis) as any
const redisSingleton = factory()
export default redisSingleton
