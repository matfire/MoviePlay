import Hit from '#models/hit'
import Playlist from '#models/playlist'
import MovieService from '#services/movie_service'
import { HttpContext } from '@adonisjs/core/http'
import { Movie } from '@matfire/the_movie_wrapper'

export default class AppsController {
  async index({ view, auth, i18n }: HttpContext) {
    const user = await auth.authenticate()
    const playlists = await Playlist.query().where('userId', user.id).preload("movies")
    const publicPlaylists = await Playlist.query()
      .whereNot('userId', user.id)
      .andWhere('isPublic', true)
      .preload("movies")
    const hits = await Hit.query()
      .whereIn(
        'playlistId',
        playlists.map((e) => e.id)
      )
      .count('*', 'total')
    const moviesData = new Map<number, Movie>()
    await Promise.allSettled(playlists.map(async (p) =>
      await Promise.allSettled(p.movies.map(async (m) => {
        if (!moviesData.has(m.tmdbId)) {
          moviesData.set(m.tmdbId, await MovieService.getMovie(m.tmdbId, i18n.locale))
        }
      }
      ))
    ))
    return view.render('pages/app/index', {
      playlists,
      hits: hits[0].$extras.total ?? 0,
      publicPlaylists,
      moviesData
    })
  }
  async create({ view }: HttpContext) {
    return view.render('pages/app/playlist/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = request.all()
    const p = await Playlist.create({
      userId: auth.user?.id,
      isPublic: data.isPublic,
      name: data.title,
      description: data.description,
    })
    return response.redirect().toRoute('app_playlists#show', { id: p.id })
  }
}
