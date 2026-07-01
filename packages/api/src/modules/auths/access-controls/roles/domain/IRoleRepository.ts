import type { IBaseRepository, RootId } from '../../../../primitives'
import type { Permission } from '../../permissions'
import type { Role } from './Role'

export interface IRoleRepository extends IBaseRepository<Role> {
  addPermissionToRole(roleId: RootId, permissionId: RootId): Promise<void>

  removePermissionToRole(roleId: RootId, permissionId: RootId): Promise<void>

  findPermissionsForRole(roleId: RootId): Promise<Permission[]>

  ensureRoleHasThisPermission(
    roleId: RootId,
    permissionId: RootId
  ): Promise<boolean>
}
