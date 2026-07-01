import { getTemporalNow } from '../../../../../helpers'
import {
  AlreadyExistsError,
  BaseDescription,
  BaseName,
  NotFoundError,
  RootId,
  TempoUpdatedAt,
  type IBaseRepository,
} from '../../../../primitives'
import { Permission } from '../domain'

export class EditPermission {
  private readonly _permissionRepository: IBaseRepository<Permission>

  constructor(permissionRepository: IBaseRepository<Permission>) {
    this._permissionRepository = permissionRepository
  }

  async handler(id: string, name: string, description: string): Promise<void> {
    const permissionToEdit: Permission | null =
      await this._permissionRepository.findOne(RootId.create(id))
    if (!permissionToEdit) throw new NotFoundError('Permission not found!')

    const permissionName: BaseName = BaseName.create(name)

    if (permissionName.value !== permissionToEdit.name.value) {
      const permissionExists: boolean =
        await this._permissionRepository.ensureAlreadyExists(permissionName)
      if (permissionExists)
        throw new AlreadyExistsError('Permission already exists!')
    }

    return await this._permissionRepository.edit(
      new Permission(
        permissionToEdit.id,
        permissionName,
        BaseDescription.create(description),
        permissionToEdit.createdAt,
        TempoUpdatedAt.create(getTemporalNow()),
        permissionToEdit.deletedAt
      )
    )
  }
}
