import 'dotenv/config'

export const {
  NODE_ENV = 'development',
  PORT = '3000',
  ACCEPTED_ORIGINS = 'http://localhost:4000,http://localhost:5173',
  DB_FILE_NAME = 'file:local.db',
  SALT_ROUNDS = '10',
  USER_ADMIN_ROLE = '019ee26f-328d-71ed-b1f2-9260d491d22d',
  USER_ADMIN_PASSWORD = 'Password123/*',
  USER_SUPPORT_PASSWORD = 'Password456/*',
  JWT_SECRET = 'a-string-secret-at-least-256-bits-long',
  JWT_ALG = 'HS256',
  JWT_ISSUER = 'urn:example:issuer',
  JWT_CLAIM = 'urn:example:claim',
} = process.env
