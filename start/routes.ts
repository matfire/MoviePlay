/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

const AuthController = () => import('#controllers/auth_controller')
const AppsController = () => import('#controllers/apps_controller')
const PlaylistsController = () => import('#controllers/playlists_controller')
import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
const MoviesController = () => import('#controllers/movies_controller')

router.on('/').render('pages/home')
router.get('/login', [AuthController, 'login']).as('login').use(middleware.guest())
router.get('/logout', [AuthController, 'logout']).as('logout').use(middleware.auth())
router
  .get('/auth/github/redirect', [AuthController, 'redirectToGithub'])
  .as('login.github_redirect')
  .use(middleware.guest())
router
  .get('/auth/github/callback', [AuthController, 'handleGithubCallback'])
  .use(middleware.guest())
router
  .get('/auth/google/redirect', [AuthController, 'redirectToGoogle'])
  .as('login.google_redirect')
  .use(middleware.guest())
router
  .get('/auth/google/callback', [AuthController, 'handleGoogleCallback'])
  .use(middleware.guest())
router.get('/app', [AppsController, 'index']).as('app').use(middleware.auth())
router.get('/app/movies/:id', [MoviesController, 'show']).as('app_movies.show')
router
  .delete('/app/movies', [MoviesController, 'remove'])
  .as('app_movies.delete')
  .use(middleware.auth())
router
  .resource('/app/playlists', PlaylistsController)
  .as('app_playlists')
  .use(['create', 'store', 'destroy', 'update'], middleware.auth())
router
  .get('/app/playlists/:playlistId/movies', [PlaylistsController, 'showAddMovie'])
  .as('app_playlists.add_movie')
  .use(middleware.auth())
router
  .post('/app/playlists/:playlistId/movies', [PlaylistsController, 'storeAddMovie'])
  .as('app_playlists.store_add_movie')
  .use(middleware.auth())
router.get('/theme/:color', async ({ params, session, response }) => {
  session.put('theme', params.color)
  response.redirect().back()
})
