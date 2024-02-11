import type { HttpContext } from '@adonisjs/core/http'
import API from '@matfire/the_movie_wrapper'
import env from '#start/env'
export default class MoviesController {
  async search({ request }: HttpContext) {
    const data = await request.all()
    console.log(data)
    const res = await new API(env.get('TMDB_API_KEY')).movies.search({ query: data.query })
    console.log(res)
    return { message: 'ok' }
  }
}
