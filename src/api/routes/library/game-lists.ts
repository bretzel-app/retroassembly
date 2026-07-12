import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { z } from 'zod'
import { addRomToGameList } from '#@/controllers/game-lists/add-rom-to-game-list.ts'
import { createGameList } from '#@/controllers/game-lists/create-game-list.ts'
import { deleteGameList } from '#@/controllers/game-lists/delete-game-list.ts'
import { getGameLists } from '#@/controllers/game-lists/get-game-lists.ts'
import { removeRomFromGameList } from '#@/controllers/game-lists/remove-rom-from-game-list.ts'
import { updateGameList } from '#@/controllers/game-lists/update-game-list.ts'

export const gameLists = new Hono()

  .get(
    '',

    zValidator(
      'query',
      z.object({
        rom_id: z.string().optional(),
      }),
    ),

    async (c) => {
      const { rom_id: romId } = c.req.valid('query')
      const result = await getGameLists({ romId })
      return c.json(result)
    },
  )

  .post(
    '',

    zValidator(
      'json',
      z.object({
        description: z.string().max(4000).optional(),
        name: z.string().trim().min(1).max(100),
      }),
    ),

    async (c) => {
      const result = await createGameList(c.req.valid('json'))
      return c.json(result)
    },
  )

  .patch(
    ':listId',

    zValidator(
      'json',
      z.object({
        description: z.string().max(4000).optional(),
        name: z.string().trim().min(1).max(100).optional(),
      }),
    ),

    async (c) => {
      const listId = c.req.param('listId')
      const result = await updateGameList(listId, c.req.valid('json'))
      return c.json(result)
    },
  )

  .delete(':listId', async (c) => {
    const listId = c.req.param('listId')
    await deleteGameList(listId)
    return c.json(null)
  })

  .post(
    ':listId/roms',

    zValidator(
      'json',
      z.object({
        romId: z.string().min(1),
      }),
    ),

    async (c) => {
      const listId = c.req.param('listId')
      const { romId } = c.req.valid('json')
      const result = await addRomToGameList({ listId, romId })
      return c.json(result)
    },
  )

  .delete(':listId/roms/:romId', async (c) => {
    const { listId, romId } = c.req.param()
    await removeRomFromGameList({ listId, romId })
    return c.json(null)
  })
