import Playlist from '#models/playlist'
import env from '#start/env'
import API from '@matfire/the_movie_wrapper'
import type { HttpContext } from '@adonisjs/core/http'

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
    console.log(playlist.movies)
    return view.render('pages/app/playlist/show', { playlist })
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
    console.log(data)
    return response.redirect().toRoute('app_playlists.add_movie', { playlistId: params.playlistId })
  }
  // edit({ view }: HttpContext) {
  //   return view.render('playlists/edit')
  // }
  // update({ view }: HttpContext) {
  //   return view.render('playlists/update')
  // }
  // destroy({ view }: HttpContext) {
  //   return view.render('playlists/destroy')
  // }
}
