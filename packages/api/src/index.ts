import express from 'express'
import cookieParser from 'cookie-parser'
import { corsMiddleware, errorHandlerMiddleware } from './middlewares'

export const api = express()

api.use(express.json())
api.use(corsMiddleware())
api.use(cookieParser())

api.get('/', (_, res) => res.send('Hello world!'))

api.use(errorHandlerMiddleware)
