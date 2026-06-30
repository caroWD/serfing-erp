import { Router } from 'express'
import { permissionRouter } from './modules'

export const routes: Router = Router()

routes.use('/permission', permissionRouter)
