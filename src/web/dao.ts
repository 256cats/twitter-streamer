import { IBBox, IDistance, ITweet } from '../common/interfaces.d'
import { client } from '../common/elastic'
import redis from '../common/redis'
import config from '../common/config'
import { stringify } from '../common/serializer'
const { streamAdd, streamRemove } = config.redis.channel
const { streams } = config.redis.key
const DEFAULT_RESULT_COUNT = 1000

import { get } from 'lodash'

export function getResults(esResponse: any): Array<ITweet> {
  return get(esResponse, 'hits.hits', [])
    .filter(item => typeof item._source !== 'undefined')
    .map(item => ({ _id: item._id, ...item._source}))
}

export async function addStream(bbox: IBBox) {
  const bboxString = stringify(bbox)
  await redis.sadd(streams, bboxString)
}

export async function removeStream(bbox: IBBox) {
  const bboxString = stringify(bbox)
  await redis.srem(streams, bboxString)
}

export async function preload(distance: IDistance, lastId: string, timestampMs?: number) {
  const body = {
    query: {
      bool : {
        must : [],
        filter : [{
          geo_distance : {
            distance : `${distance.radius}km`,
            'coordinates.coordinates': [distance.lon, distance.lat]
          }
        }] as any
      }
    },
    size: DEFAULT_RESULT_COUNT
  }

  if (lastId) {
    body.query.bool.must.push({ range: {
      id: { gt:  lastId }
    }})
  } else if (timestampMs) {
    body.query.bool.must.push({ range: {
      timestamp_ms: { gte:  timestampMs }
    }})
  }

  const response = await client.search({
    index: config.elastic.index.name,
    type: config.elastic.index.type,
    body
  })

  return getResults(response) as Array<ITweet>
}
