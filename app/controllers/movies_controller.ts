import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async show({ view, params }: HttpContext) {
    const movie = await MovieService.getMovie(params.id)
    return view.render('app/movies/show', {
      movie,
    })
  }
}
