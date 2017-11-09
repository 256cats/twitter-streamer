import * as Twitter from 'twitter'
import { IBBox } from '../common/interfaces.d'
import { addTweet } from './dao'
export type TStreams = { [index: string]: IBBox }

let twitterStream = undefined

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

function getLocations(streams: TStreams) {
  return Object.keys(streams).map(id => {
    const { top, left, bottom, right } = streams[id]
    return `${left},${bottom},${right},${top}`
  }).join(',')
}

export function restartStream(streams: TStreams) {
  console.log('restartStreams', Object.keys(streams).length)
  if (Object.keys(streams).length > 0) { // restart stream
    console.log('locations', getLocations(streams))
    const newStream = client.stream('statuses/filter', {
      locations: getLocations(streams)
    })

    newStream.on('data', function(event) {
      console.log('data', event && event.coordinates && event.text)
      if (event && event.text && event.coordinates) {
        event.timestamp_ms = parseInt(event.timestamp_ms, 10)
        addTweet(event)
      }
    })

    newStream.on('error', function(error) {
      throw error
    })

    if (typeof twitterStream !== 'undefined') { // stop old stream
      twitterStream.destroy()
    }

    twitterStream = newStream
  } else { // stop stream
    if (typeof twitterStream !== 'undefined') {
      twitterStream.destroy()
      twitterStream = undefined
    }
  }

}
