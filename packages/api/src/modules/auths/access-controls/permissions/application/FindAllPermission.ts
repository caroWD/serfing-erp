import type { IBaseRepository } from '../../../../primitives'
import { PermissionDto, type Permission } from '../domain'

export class FindAllPermission {
  private readonly _permissionRepository: IBaseRepository<Permission>

  constructor(permissionRepository: IBaseRepository<Permission>) {
    this._permissionRepository = permissionRepository
  }

  async handler(): Promise<PermissionDto[]> {
    const permissions: Permission[] = await this._permissionRepository.findAll()

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
