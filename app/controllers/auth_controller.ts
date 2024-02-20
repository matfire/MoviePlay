// import type { HttpContext } from '@adonisjs/core/http'

import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ view }: HttpContext) {
    return view.render('pages/login')
  }
  async redirectToGithub({ ally }: HttpContext) {
    await ally.use('github').redirect()
  }

  async redirectToGoogle({ ally }: HttpContext) {
    await ally.use('google').redirect()
  }

  async handleGithubCallback({ ally, response, auth }: HttpContext) {
    const githubUser = await ally.use('github').user()
    const user = await User.query()
      .where('githubId', githubUser.id)
      .orWhere('email', githubUser.email)
      .first()
    if (!user) {
      const newUser = await User.create({
        email: githubUser.email,
        fullName: githubUser.name,
        githubId: githubUser.id,
      })
      await auth.use('web').login(newUser)
    } else {
      user.githubId = githubUser.id
      await user.save()
      await auth.use('web').login(user)
    }
    response.redirect('/app')
  }
  async handleGoogleCallback({ ally, response, auth }: HttpContext) {
    const googleUser = await ally.use('google').user()
    const user = await User.query()
      .where('googleId', googleUser.id)
      .orWhere('email', googleUser.email)
      .first()
    if (!user) {
      const newUser = await User.create({
        email: googleUser.email,
        fullName: googleUser.name,
        googleId: googleUser.id,
      })
      await auth.use('web').login(newUser)
    } else {
      user.googleId = googleUser.id
      await user.save()
      await auth.use('web').login(user)
    }
    response.redirect('/app')
  }
}
