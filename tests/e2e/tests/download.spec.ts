import path from 'node:path'
import { expect, mergeTests } from '@playwright/test'
import { test as pagesTest } from '../fixtures/pages.ts'
import { test as romsTest } from '../fixtures/roms.ts'
import { test as userTest } from '../fixtures/user.ts'

const test = mergeTests(pagesTest, romsTest, userTest)

const romDetailUrl = /\/library\/platform\/.+\/rom\/.+/u

test('shows a download button that saves the original rom file', async ({
  page,
  pages: { library, login },
  roms,
  user,
}) => {
  await login.login(user)
  const [rom] = roms.slice(0, 1)
  await library.uploadROMs([rom])

  await page.locator('.game-entry').first().click()
  await page.waitForURL(romDetailUrl)

  const downloadButton = page.getByRole('link', { name: 'download' })
  await expect(downloadButton).toBeVisible()

  const downloadPromise = page.waitForEvent('download')
  await downloadButton.click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe(path.basename(rom.path))
})

test('serves the rom as an attachment when the download flag is set', async ({
  page,
  pages: { library, login },
  roms,
  user,
}) => {
  await login.login(user)
  const [rom] = roms.slice(0, 1)
  await library.uploadROMs([rom])

  await page.locator('.game-entry').first().click()
  await page.waitForURL(romDetailUrl)

  const href = await page.getByRole('link', { name: 'download' }).getAttribute('href')
  expect(href).toContain('download=1')

  const response = await page.request.get(href ?? '')
  expect(response.status()).toBe(200)
  const disposition = response.headers()['content-disposition'] ?? ''
  expect(disposition).toContain('attachment')
  expect(disposition).toContain(encodeURIComponent(path.basename(rom.path)))
})

test('returns 404 when downloading an unknown rom id', async ({ page, pages: { login }, user }) => {
  await login.login(user)

  const response = await page.request.get('/api/v1/roms/nonexistent-rom-id/content?download=1')
  expect(response.status()).toBe(404)
})
