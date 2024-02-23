import Playlist from '#models/playlist'
import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import MovieService from '#services/movie_service'
import Hit from '#models/hit'

export default class PlaylistsController {
  // index({ view }: HttpContext) {
  //   return view.render('playlists/index')
  // }
  async create({ view }: HttpContext) {
    return view.render('pages/app/playlist/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.all()
    const user = await auth.authenticate()
    const p = await Playlist.create({
      userId: user.id,
      isPublic: data.isPublic === 'on',
      name: data.title,
      description: data.description,
    })
    return response.redirect().toRoute('app_playlists.show', { id: p.id })
  }
  async show({ view, params, auth, i18n, response, session }: HttpContext) {
    const user = await auth.authenticate()
    const lang = i18n.locale
    const playlist = await Playlist.findOrFail(params.id)
    if (!auth.isAuthenticated && !playlist.isPublic) {
      session.flash('notification', {
        message: i18n.t('error.unauthorized_playlist'),
        type: 'error',
      })
      return response.redirect().back()
    }
    if (playlist.userId !== user.id) {
      await Hit.create({ playlistId: playlist.id })
    }
    const moviesDb = await Movie.query().where('playlistId', playlist.id)
    const movies = []
    for (const movie of moviesDb) {
      const data = await MovieService.getMovie(movie.tmdbId, lang)
      movies.push(data)
    }
    return view.render('pages/app/playlist/show', {
      playlist,
      movies,
    })
  }

  async showAddMovie({ view, auth, request, params, i18n }: HttpContext) {
    await auth.authenticate()
    //TODO check if user is playlist author
    const playlist = await Playlist.find(params.playlistId)
    const data = request.all()
    let movies = null
    if (data.query) {
      const res = await MovieService.searchMovies(data.query, i18n.locale)
      movies = res.results
    }
    return view.render('pages/app/playlist/add_movie', { playlist, movies, query: data.query })
  }

  async storeAddMovie({ auth, request, response, params, session, i18n }: HttpContext) {
    const data = request.all()
    await auth.authenticate()
    //TODO check if user is playlist author
    const playlist = await Playlist.findOrFail(params.playlistId)
    const order = (playlist?.movies?.sort((a, b) => a.order - b.order).pop()?.order ?? 0) + 1
    await Movie.create({
      tmdbId: data.tmdbId,
      playlistId: playlist.id,
      order,
    })
    session.flash('notification', {
      type: 'success',
      message: i18n.t('messages.success.movie_add_playlist'),
    })
    return response
      .redirect()
      .toRoute(
        'app_playlists.add_movie',
        { playlistId: params.playlistId },
        { qs: { query: data.query } }
      )
  }
  async edit({ view, params, auth, i18n }: HttpContext) {
    await auth.authenticate()
    const playlist = await Playlist.findOrFail(params.id)
    const moviesDb = await Movie.query().where('playlistId', playlist.id)
    const movies = []
    for (const movie of moviesDb) {
      const data = await MovieService.getMovie(movie.tmdbId, i18n.locale)
      movies.push({ ...data, order: movie.order })
    }
    return view.render('pages/app/playlist/edit', { playlist, movies })
  }
  async update({ request, response, params, auth }: HttpContext) {
    await auth.authenticate()
    const playlist = await Playlist.findOrFail(params.id)
    const data = request.all()
    playlist.name = data.name
    playlist.description = data.description
    playlist.isPublic = data.isPublic === 'on'
    const moviesOrder = new Map<number, number>()
    Object.keys(data).forEach((e) => {
      if (e.startsWith('movie_order')) {
        if (moviesOrder.has(Number.parseInt(e.split(':')[1]))) {
          throw new Error('duplicate movie order set')
        }
        const id = Number.parseInt(e.split(':')[1])
        moviesOrder.set(id, Number.parseInt(data[e]))
      }
    })
    const movies = await Movie.query().where('playlistId', playlist.id)
    for (const movie of movies) {
      if (moviesOrder.has(movie.tmdbId) && !Number.isNaN(moviesOrder.get(movie.tmdbId))) {
        movie.order = moviesOrder.get(movie.tmdbId)!
        await movie.save()
      }
    }
    await playlist.save()
    return response.redirect().toRoute('app_playlists.show', { id: params.id })
  }
  // destroy({ view }: HttpContext) {
  //   return view.render('playlists/destroy')
  // }
}
