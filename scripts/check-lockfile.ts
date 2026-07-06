import fs from 'fs-extra'

const lockFileContent = await fs.readFile('pnpm-lock.yaml', 'utf8')
const isValidLockFile = lockFileContent.includes(
  'https://codeload.github.com/cloudflare/react-router-hono-fullstack-template',
)
if (!isValidLockFile) {
  throw new Error('Invalid pnpm-lock.yaml')
}
