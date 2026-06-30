import { PermissionShared } from '../modules'
import { permissionSqliteRepository } from './dependencies'

export const serviceContainer = {
  auth: {
    accessControl: {
      permission: new PermissionShared(permissionSqliteRepository),
    },
  },
}
