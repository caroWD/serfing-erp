import 'dotenv/config'

export const {
  PORT = '3000',
  ACCEPTED_ORIGINS = 'http://localhost:4000,http://localhost:5173',
  DB_FILE_NAME = 'file:local.db',
  SALT_ROUNDS = '10',
  USER_ADMIN_PASSWORD = 'Password123/*',
  USER_SUPPORT_PASSWORD = 'Password456/*',
} = process.env
