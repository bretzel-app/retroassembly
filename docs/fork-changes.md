# Fork Changes

All changes made in this fork (`bretzel-app/retroassembly`) on top of the upstream repo (`arianrhodsandlot/retroassembly`).

## Active Changes

### Top 100 Ranking System

A per-platform "Top 100" ranking system that sorts the game library by popularity.

- Bundled JSON ranking data for each platform including PSX
- New `top100_ranks` database table and migration
- Seeding logic that populates rankings on app startup
- ROM query extended with a `top100` sort option using fuzzy name matching
  (strips region tags, normalizes punctuation, handles "Name, The" format)
- "Top 100" option in sort dropdown, set as default sort order
- `top100Rank` field included in ROM query results

### Increased Search Results Limit

Search results increased from 10 to 100 items (both API page size and UI display limit).

### Automated Docker Releases

The `docker-publish.yaml` workflow was enhanced to:

- Auto-generate version tags in the format `v{MAJOR}.YYMMDD.HHMM`
- Create and push git tags on each release
- Pass the version tag as a build arg (`RETROASSEMBLY_BUILD_TIME_VITE_VERSION`)
- Gate builds on the test workflow passing first

### Orphaned Launch Records Fix

Launch records referencing deleted ROMs were causing errors. Fixed by filtering them out post-query (rather than in the WHERE clause, which caused issues with Drizzle ORM joins). Also loosened the `useRomCover` hook type to accept nullable rom fields.

## Notes

- The `docs/superpowers/` directory is gitignored — it contains local planning docs used during development.
