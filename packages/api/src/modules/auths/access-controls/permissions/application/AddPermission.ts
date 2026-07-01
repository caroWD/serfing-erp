import { getTemporalNow } from '../../../../../helpers'
import {
  AlreadyExistsError,
  BaseDescription,
  BaseName,
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
  type IBaseRepository,
} from '../../../../primitives'
import { Permission } from '../domain'

export class AddPermission {
  private readonly _permissionRepository: IBaseRepository<Permission>

  constructor(permissionRepository: IBaseRepository<Permission>) {
    this._permissionRepository = permissionRepository
  }

  async handler(id: string, name: string, description: string): Promise<void> {
    const permissionName: BaseName = BaseName.create(name)

    const permissionExists: boolean =
      await this._permissionRepository.ensureAlreadyExists(permissionName)
    if (permissionExists)
      throw new AlreadyExistsError('Permission already exists!')

    return await this._permissionRepository.add(
      new Permission(
        RootId.create(id),
        permissionName,
        BaseDescription.create(description),
        TempoCreatedAt.create(getTemporalNow()),
        TempoUpdatedAt.create(getTemporalNow()),
        TempoDeletedAt.create(null)
      )
    )
  }
}
