import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { DB_FILE_NAME } from '../../config'

const client = createClient({ url: DB_FILE_NAME })
export const sqlite = drizzle({ client })
