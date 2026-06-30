import { DrizzleError, DrizzleQueryError } from 'drizzle-orm/errors'
import type { ErrorRequestHandler } from 'express'

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (error instanceof DrizzleError || error instanceof DrizzleQueryError) {
    res.status(500).json({ message: error.message, status: false })
    return
  }

  if (error instanceof Error) {
    res.status(500).json({ message: error.message, status: false })
    return
  }

  res.status(500).json({ message: 'Something went wrong!', state: false })
  return

  next(error)
}
