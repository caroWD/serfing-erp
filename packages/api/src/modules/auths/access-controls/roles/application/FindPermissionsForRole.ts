import { RootId } from '../../../../primitives'
import { PermissionDto, type Permission } from '../../permissions'
import type { IRoleRepository } from '../domain'

export class FindPermissionsForRole {
  private readonly _roleRepository: IRoleRepository

  constructor(roleRepository: IRoleRepository) {
    this._roleRepository = roleRepository
  }

  async handler(roleId: string): Promise<PermissionDto[]> {
    const permissions: Permission[] =
      await this._roleRepository.findPermissionsForRole(RootId.create(roleId))

    return !permissions.length
      ? []
      : permissions.map(
          (permission) =>
            new PermissionDto(
              permission.id.value,
              permission.name.value,
              permission.description.value,
              permission.createdAt.value.toJSON(),
              permission.updatedAt.value.toJSON(),
              permission.deletedAt.value?.toJSON() || null
            )
        )
  }
}
