import { defineConfig } from 'drizzle-kit'
import { DB_FILE_NAME } from './config'

export default defineConfig({
  out: './drizzle',
  schema: './src/db/sqlite-schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: DB_FILE_NAME,
  },
})
