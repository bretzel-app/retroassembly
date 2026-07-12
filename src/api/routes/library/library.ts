import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { favorites } from './favorites.ts'
import { files } from './files.ts'
import { gameLists } from './game-lists.ts'
import { launchRecords } from './launch-records.ts'
import { preference } from './preference.ts'
import { roms } from './roms.ts'
import { states } from './states.ts'

const authMiddleware = createMiddleware(async (c, next) => {
  const { unauthorized } = c.var
  if (unauthorized) {
    return c.json({ message: 'Unauthorized' }, 400)
  }
  return await next()
})

export const app = new Hono()
  .use(authMiddleware)
  .route('favorites', favorites)
  .route('files', files)
  .route('game_lists', gameLists)
  .route('launch_records', launchRecords)
  .route('preference', preference)
  .route('roms', roms)
  .route('states', states)
