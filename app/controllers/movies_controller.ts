import type { HttpContext } from '@adonisjs/core/http'
import API from '@matfire/the_movie_wrapper'
import env from '#start/env'
export default class MoviesController {
  async search({ request }: HttpContext) {
    const data = await request.all()
    const res = await new API(env.get('TMDB_API_KEY')).movies.search({ query: data.query })
    return { message: 'ok' }
  }
}
