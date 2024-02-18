import vine from '@vinejs/vine'

export const createMovieValidator = vine.compile(
  vine.object({
    tmdbId: vine.number(),
  })
)
