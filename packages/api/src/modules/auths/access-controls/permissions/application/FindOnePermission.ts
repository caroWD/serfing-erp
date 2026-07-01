import {
  NotFoundError,
  RootId,
  type IBaseRepository,
} from '../../../../primitives'
import { PermissionDto, type Permission } from '../domain'

export class FindOnePermission {
  private readonly _permissionRepository: IBaseRepository<Permission>

  constructor(permissionRepository: IBaseRepository<Permission>) {
    this._permissionRepository = permissionRepository
  }

  async handler(id: string): Promise<PermissionDto> {
    const permissionFinded: Permission | null =
      await this._permissionRepository.findOne(RootId.create(id))
    if (!permissionFinded) throw new NotFoundError('Permission not found!')

    return new PermissionDto(
      permissionFinded.id.value,
      permissionFinded.name.value,
      permissionFinded.description.value,
      permissionFinded.createdAt.value.toJSON(),
      permissionFinded.updatedAt.value.toJSON(),
      permissionFinded.deletedAt.value?.toJSON() || null
    )
  }
}
