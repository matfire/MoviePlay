import Movie from '#models/movie'
import Playlist from '#models/playlist'
import MovieService from '#services/movie_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class MoviesController {
  async show({ view, params, i18n, auth }: HttpContext) {
    const user = await auth.authenticate()
    const movies = await Movie.query().where('tmdb_id', params.id)
    const playlists = await Playlist.query()
      .whereIn(
        'id',
        movies.map((e) => e.playlistId)
      )
      .andWhere('user_id', user.id)
      .orWhere('is_public', true)

    const movie = await MovieService.getMovie(params.id, i18n.locale, [
      'credits',
      'videos',
      'images',
      'similar',
    ])
    return view.render('pages/app/movie/show', {
      movie,
      playlists,
    })
  }
  async remove({ auth, request, i18n, session, response }: HttpContext) {
    //TODO check for user permissions
    await auth.authenticate()
    const { movieId, playlistId } = request.all()
    const movie = await Movie.query()
      .where('id', movieId)
      .andWhere('playlistId', playlistId)
      .first()
    if (!movie) {
      session.flash('notification', { type: 'error', message: i18n.t('movie.delete.error') })
      return response.redirect().back()
    }
    await movie.delete()
    session.flash('notification', { type: 'success', message: i18n.t('movie.delete.success') })
    return response.redirect().back()
  }
}
