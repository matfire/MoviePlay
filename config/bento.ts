import { BentoCache, bentostore } from 'bentocache'
import { memoryDriver } from 'bentocache/drivers/memory'

export const bento = new BentoCache({
  default: 'movies',
  stores: {
    // A first cache store named "myCache" using
    // only L1 in-memory cache
    movies: bentostore().useL1Layer(memoryDriver({ maxSize: 10_000 })),
  },
})
