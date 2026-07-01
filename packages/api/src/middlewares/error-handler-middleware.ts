import { DrizzleError, DrizzleQueryError } from 'drizzle-orm/errors'
import type { ErrorRequestHandler } from 'express'
import {
  AlreadyExistsError,
  DomainError,
  NotFoundError,
  UnauthorizedError,
} from '../modules'
import { ZodError } from 'zod'

export const errorHandlerMiddleware: ErrorRequestHandler = (
  error,
  _req,
  res,
  next
) => {
  if (error instanceof ZodError) {
    res.status(422).json({ message: JSON.parse(error.message), status: false })
    return
  }

  if (error instanceof DomainError || error instanceof AlreadyExistsError) {
    res.status(422).json({ message: error.message, status: false })
    return
  }

  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message, status: false })
    return
  }

  if (error instanceof UnauthorizedError) {
    res.status(401).json({ message: error.message, status: false })
    return
  }

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
