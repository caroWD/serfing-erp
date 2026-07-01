import { sqlite } from '../../config'
import { DrizzleSqlitePermissionRepository } from '../../modules/auths/access-controls/permissions/infrastructure/repositories'
import { DrizzleSqliteRoleRepository } from '../../modules/auths/access-controls/roles/infrastructure/repositories'
import { DrizzleSqliteUserRepository } from '../../modules/auths/users/infrastructure/repositories'

export const permissionSqliteRepository = new DrizzleSqlitePermissionRepository(
  sqlite
)

export const roleSqliteRepository = new DrizzleSqliteRoleRepository(sqlite)

export const userSqliteRepository = new DrizzleSqliteUserRepository(sqlite)
