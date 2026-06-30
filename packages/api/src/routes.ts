import { Router } from 'express'
import { permissionRouter, roleRouter } from './modules'

export const routes: Router = Router()

routes.use('/permission', permissionRouter)
routes.use('/role', roleRouter)
