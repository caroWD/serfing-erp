import { PermissionShared, RoleShared } from '../modules'
import {
  permissionSqliteRepository,
  roleSqliteRepository,
} from './dependencies'

export const serviceContainer = {
  auth: {
    accessControl: {
      permission: new PermissionShared(permissionSqliteRepository),
      role: new RoleShared(roleSqliteRepository, permissionSqliteRepository),
    },
  },
}
