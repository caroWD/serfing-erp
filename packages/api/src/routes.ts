import { Router } from 'express'
import { permissionRouter, roleRouter, userRouter } from './modules'

export const routes: Router = Router()

routes.use('/user', userRouter)
routes.use('/permission', permissionRouter)
routes.use('/role', roleRouter)
