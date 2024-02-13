import Playlist from '#models/playlist'
import env from '#start/env'
import API from '@matfire/the_movie_wrapper'
import type { HttpContext } from '@adonisjs/core/http'
import Movie from '#models/movie'
import { bento } from '#config/bento'

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
    console.log(data)
    const p = await Playlist.create({
      userId: user.id,
      isPublic: data.isPublic,
      name: data.title,
      description: data.description,
    })
    return response.redirect().toRoute('app_playlists.show', { id: p.id })
  }
  async show({ view, params, auth }: HttpContext) {
    await auth.authenticate()
    const playlist = await Playlist.findOrFail(params.id)
    const tmdbClient = await new API(env.get('TMDB_API_KEY'))
    const movies = await Promise.all(
      (await Movie.query().where('playlistId', playlist.id)).map(async (e) => {
        const data = await bento.getOrSet(
          `${e.tmdbId}`,
          () => {
            console.log(`id ${e.tmdbId} not found in cache, fetching...`)
            return tmdbClient.movies.getMovie(e.tmdbId)
          },
          { ttl: '5m' }
        )
        return data
      })
    )
    return view.render('pages/app/playlist/show', { playlist, movies })
  }

  async showAddMovie({ view, auth, request, params }: HttpContext) {
    await auth.authenticate()
    //TODO check if user is playlist author
    const playlist = await Playlist.find(params.playlistId)
    const data = request.all()
    let movies = null
    console.log(data)
    if (data.query) {
      const res = await new API(env.get('TMDB_API_KEY')).movies.search({ query: data.query })
      movies = res.results
    }
    return view.render('pages/app/playlist/add_movie', { playlist, movies })
  }

  async storeAddMovie({ view, auth, request, response, params }: HttpContext) {
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
    console.log(data)
    return response.redirect().toRoute('app_playlists.add_movie', { playlistId: params.playlistId })
  }
  async edit({ view, params, auth }: HttpContext) {
    await auth.authenticate()
    const playlist = await Playlist.findOrFail(params.id)
    const tmdbClient = await new API(env.get('TMDB_API_KEY'))
    const movies = await Promise.all(
      (await Movie.query().where('playlistId', playlist.id)).map(async (e) => {
        const data = await bento.getOrSet(
          `${e.tmdbId}`,
          () => {
            console.log(`id ${e.tmdbId} not found in cache, fetching...`)
            return tmdbClient.movies.getMovie(e.tmdbId)
          },
          { ttl: '5m' }
        )
        return data
      })
    )
    return view.render('pages/app/playlist/edit', { playlist, movies })
  }
  async update({ request, response, params, auth }: HttpContext) {
    await auth.authenticate()
    const playlist = await Playlist.findOrFail(params.id)
    const data = request.all()
    console.log(data)
    playlist.name = data.name
    playlist.description = data.description
    playlist.isPublic = data.isPublic
    await playlist.save()
    return response.redirect().toRoute('app_playlists.show', { id: params.id })
  }
  // destroy({ view }: HttpContext) {
  //   return view.render('playlists/destroy')
  // }
}
