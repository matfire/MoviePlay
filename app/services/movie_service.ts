import API, { Language, AppendToResponseMovie } from '@matfire/the_movie_wrapper'

import { bento } from '#config/bento'
import env from '#start/env'

export default class MovieService {
  static async getMovie(id: number, lang = 'en', extras: AppendToResponseMovie[] = []) {
    const tmdbClient = await new API(env.get('TMDB_API_KEY'))
    tmdbClient.setLanguage(lang as Language)
    const data = await bento.getOrSet(`${id}:${lang}${extras.length > 0 ? ':extras' : ''}`, () =>
      tmdbClient.movies.getMovie(id, extras)
    )
    return data
  }
  static async searchMovies(query: string, lang = 'en') {
    const tmdbClient = await new API(env.get('TMDB_API_KEY'))
    tmdbClient.setLanguage(lang as Language)
    const data = await bento.getOrSet(`${query}:${lang}`, () => tmdbClient.movies.search({ query }))
    return data
  }
}
