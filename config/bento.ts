import env from '#start/env'
import { BentoCache, bentostore } from 'bentocache'
import { memoryDriver } from 'bentocache/drivers/memory'

export const bento = new BentoCache({
  default: 'movies',
  stores: {
    movies: bentostore({ ttl: '24h' })
      .useL1Layer(memoryDriver({ maxSize: 10_000 }))
  },
})
