import { IBBox, IDistance, ITweet } from '../common/interfaces.d'
export interface IClient {
  bbox: IBBox;
  delay: number;
  socket: any;
  distance: IDistance;
  lastId?: string;
  tweets: Array<ITweet>;
}

export type TClients = { [id: string]: IClient }
const clients: TClients = {}
