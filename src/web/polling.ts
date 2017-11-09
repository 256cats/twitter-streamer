import { TClients, IClient } from './socket'
import config from '../common/config'
import { IBBox, ITweet } from '../common/interfaces.d'
import { preload } from './dao'
import { uniqBy } from 'lodash'
const ms = 1000
const PRELOAD_THRESHOLD = 100
let interval = undefined

async function loadTweets(client: IClient) {
  const ts = client.tweets.length > 0
    ? client.tweets[0].timestamp_ms
    : Date.now().valueOf() - client.delay * ms
  return preload(client.distance, client.lastId, ts)
}

function updateTweets(client: IClient, newTweets: Array<ITweet>) {
  client.tweets = uniqBy(client.tweets.concat(newTweets), 'id')
  client.tweets.sort((a: ITweet, b: ITweet) => a.timestamp_ms - b.timestamp_ms)
}

function publishTweets(client: IClient) {
  const timestampMs = Date.now().valueOf() - client.delay * ms
  const tweetsToPublish = []
  if (client.tweets.length === 0) {
    return
  }

  const tweetQueue = []
  client.lastId = client.tweets[0].id
  for (let idx = 0; idx < client.tweets.length; idx++) {
    const tweet = client.tweets[idx]
    console.log('publishTweets', idx, client.tweets.length)
    console.log('diff', timestampMs - tweet.timestamp_ms)
    if (tweet.timestamp_ms <= timestampMs) {
      tweetsToPublish.push(tweet)
    } else {
      tweetQueue.push(tweet)
    }
  }

  client.tweets = tweetQueue

  if (tweetsToPublish.length > 0) {
    console.log('tweetsToPublish', tweetsToPublish.map(item => item.id))
    client.socket.emit('newTweets', tweetsToPublish)
  }

}

async function poll(clients: TClients) {
  for (let id of Object.keys(clients)) {
    const client = clients[id]
    if (client.tweets.length <= PRELOAD_THRESHOLD) {
      const newTweets = await loadTweets(client)
      console.log('newTweets', newTweets.length)
      updateTweets(client, newTweets)
    }
    publishTweets(client)
  }
}

export function startPolling(clients) {
  interval = setInterval(() => poll(clients), config.server.pollingInterval)
}

export function stopPolling() {
  clearInterval(interval)
  interval = undefined
}
