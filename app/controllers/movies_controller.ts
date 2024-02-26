import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async show({ view, params, i18n }: HttpContext) {
    const movie = await MovieService.getMovie(params.id, i18n.locale)
    return view.render('pages/app/movie/show', {
      movie,
    })
  }
}
