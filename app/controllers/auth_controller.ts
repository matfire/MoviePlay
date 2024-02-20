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
    const user = await User.firstOrCreate(
      { githubId: githubUser.id },
      { email: githubUser.email, fullName: githubUser.name }
    )
    await auth.use('web').login(user)
    // do something with the user
    response.redirect('/app')
  }
  async handleGoogleCallback({ ally, response, auth }: HttpContext) {
    const googleUser = await ally.use('google').user()
/*     const user = await User.firstOrCreate(
      { googleId: googleUser.id },
      { email: googleUser.email, fullName: googleUser.name }
    )
    await auth.use('web').login(user)
    // do something with the user */
    console.log(googleUser)
    response.redirect('/app')
  }
}
