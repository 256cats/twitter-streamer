import config from '../common/config'
import { client } from '../common/elastic'
import { ITweet } from '../common/interfaces.d'

export function addTweet(tweet: ITweet) {
  return client.index({
    index: config.elastic.index.name,
    id: tweet.id,
    type: config.elastic.index.type,
    body: tweet
  })
}
