import * as elasticSearch from 'elasticsearch'
import config from './config'

export const client = new elasticSearch.Client({
  host: config.elastic.host,
  log: 'info'
})
