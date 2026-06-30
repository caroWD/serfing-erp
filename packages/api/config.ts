import 'dotenv/config'

export const {
  PORT = '3000',
  DB_FILE_NAME = 'file:local.db',
  SALT_ROUNDS = '10',
  USER_ADMIN_PASSWORD = 'Password123/*',
  USER_SUPPORT_PASSWORD = 'Password456/*',
} = process.env
