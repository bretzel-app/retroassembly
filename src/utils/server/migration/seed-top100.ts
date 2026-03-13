import { top100Data } from '#@/constants/top100/index.ts'
import { top100RankTable } from '#@/databases/schema.ts'
import { createDrizzle } from '../drizzle.ts'

export function seedTop100() {
  const db = createDrizzle().library

  // Clear existing data and re-seed (idempotent)
  db.delete(top100RankTable).run()

  const now = new Date()
  const rows: (typeof top100RankTable.$inferInsert)[] = []

  for (const [platform, entries] of Object.entries(top100Data)) {
    if (!entries) continue
    for (const entry of entries) {
      rows.push({
        createdAt: now,
        displayName: entry.originalName,
        normalizedName: entry.name,
        platform: platform as any,
        rank: entry.rank,
        updatedAt: now,
      })
    }
  }

  // Insert in chunks of 50
  for (let i = 0; i < rows.length; i += 50) {
    const chunk = rows.slice(i, i + 50)
    db.insert(top100RankTable).values(chunk).run()
  }

  console.log(`Seeded top100_ranks with ${rows.length} entries`)
}
