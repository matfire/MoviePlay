import API from '@matfire/the_movie_wrapper'

import { bento } from '#config/bento'
import env from '#start/env'

export default class MovieService {
  static async getMovie(id: number, lang = 'en') {
    const tmdbClient = await new API(env.get('TMDB_API_KEY'))
    tmdbClient.setLanguage(lang)
    const data = await bento.getOrSet(`${id}:${lang}`, () => tmdbClient.movies.getMovie(id))
    return data
  }
}
