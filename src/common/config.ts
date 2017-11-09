import * as fs from 'fs'
import { join, resolve } from 'path'

export interface IConfig {
  channel: {
    users: string;
    stream: string;
    dispatcher: string;
  },
  rabbitmq: {
    url: string;
    reconnectTimeout: number;
  },
  elastic: {
    host: string;
    index: {
      name: string;
      type: string;
    }
  },
  redis: {
    port: number;
    key: {
      streams: string;
    }
    channel: {
      streamAdd: string;
      streamRemove: string;
    }
  },
  server: {
    port: number;
    pollingInterval: number;
  }
}

const configPath  = resolve(join(__dirname, '..', '..', 'config', 'default.json'))
export default JSON.parse(fs.readFileSync(configPath, {
  encoding: 'utf8'
})) as IConfig
