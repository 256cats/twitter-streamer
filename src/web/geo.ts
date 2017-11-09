import * as turf from '@turf/turf'
import { IBBox } from '../common/interfaces.d'

export function coordinatesToBbox(lat: number, lon: number, radius: number): IBBox {
  const point = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [lon, lat]
    }
  }
  const buffered = turf.buffer(point as any, radius, 'kilometers')
  const [ left, bottom, right, top ] = turf.bbox(buffered)
  return {
    left,
    top,
    right,
    bottom
  }
}
