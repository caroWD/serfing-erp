import { PermissionShared, RoleShared, UserShared } from '../modules'
import {
  permissionSqliteRepository,
  roleSqliteRepository,
  userSqliteRepository,
} from './dependencies'

export const serviceContainer = {
  auth: {
    accessControl: {
      permission: new PermissionShared(permissionSqliteRepository),
      role: new RoleShared(roleSqliteRepository, permissionSqliteRepository),
    },
    user: new UserShared(userSqliteRepository, roleSqliteRepository),
  },
}
