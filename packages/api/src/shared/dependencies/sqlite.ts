import { sqlite } from '../../config'
import { DrizzleSqlitePermissionRepository } from '../../modules/auths/access-controls/permissions/infrastructure/repositories'

export const permissionSqliteRepository = new DrizzleSqlitePermissionRepository(
  sqlite
)
