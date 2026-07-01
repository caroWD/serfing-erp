import express from 'express'
import cookieParser from 'cookie-parser'
import { corsMiddleware, errorHandlerMiddleware } from './middlewares'
import { routes } from './routes'

export const api = express()

api.use(express.json())
api.use(corsMiddleware())
api.use(cookieParser())

api.use('/api/v01', routes)

api.use(errorHandlerMiddleware)
