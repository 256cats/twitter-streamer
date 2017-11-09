export interface ITweet {
  id: string;
  id_str: string;
  coordinates: {
    coordinates: Array<number>;
  };
  text: string;
  source: string;
  timestamp_ms: number;
}

export interface IBBox {
  top: number;
  left: number;
  bottom: number;
  right: number;
}

export interface IDistance {
  lat: number;
  lon: number;
  radius: number;
}
