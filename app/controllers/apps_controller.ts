import Hit from '#models/hit'
import Playlist from '#models/playlist'
import { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view, auth }: HttpContext) {
    const user = await auth.authenticate()
    const playlists = await Playlist.query().where('userId', user.id)
    const publicPlaylists = await Playlist.query()
      .whereNot('userId', user.id)
      .andWhere('isPublic', true)
    const hits = await Hit.query()
      .whereIn(
        'playlistId',
        playlists.map((e) => e.id)
      )
      .count('*', 'total')
    return view.render('pages/app/index', {
      playlists,
      hits: hits[0].$extras.total ?? 0,
      publicPlaylists,
    })
  }
  async create({ view }: HttpContext) {
    return view.render('pages/app/playlist/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.all()
    const p = await Playlist.create({
      userId: auth.user?.id,
      isPublic: data.isPublic,
      name: data.title,
      description: data.description,
    })
    return response.redirect().toRoute('app_playlists#show', { id: p.id })
  }
}
