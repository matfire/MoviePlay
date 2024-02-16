import env from '#start/env'
import { BentoCache, bentostore } from 'bentocache'
import { memoryDriver } from 'bentocache/drivers/memory'
import { redisDriver } from 'bentocache/drivers/redis'
import { Redis } from 'ioredis'

const redisConnection = new Redis(
  `rediss://${env.get('REDIS_USERNAME')}:${env.get('REDIS_PASSWORD')}@${env.get('REDIS_ENDPOINT')}:${env.get('REDIS_PORT')}");`
)

export const bento = new BentoCache({
  default: 'movies',
  stores: {
    movies: bentostore({ ttl: '24h' })
      .useL1Layer(memoryDriver({ maxSize: 10_000 }))
      .useL2Layer(
        redisDriver({
          connection: redisConnection,
        })
      ),
  },
})
