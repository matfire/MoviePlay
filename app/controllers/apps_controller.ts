import Playlist from '#models/playlist'
import { HttpContext } from '@adonisjs/core/http'

export default class AppsController {
  async index({ view, auth }: HttpContext) {
    const playlists = await Playlist.query().where('userId', auth.user.id)
    console.log(playlists)
    return view.render('pages/app/index', { playlists })
  }
  async create({ view }: HttpContext) {
    return view.render('pages/app/playlist/create')
  }

  async store({ request, response, auth }: HttpContext) {
    const data = await request.all()
    console.log(data)
    const p = await Playlist.create({
      userId: auth.user?.id,
      isPublic: data.isPublich,
      name: data.title,
      description: data.description,
    })
    return response.redirect().toRoute('app_playlists#show', { id: p.id })
  }
}
