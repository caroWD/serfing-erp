import { getTemporalNow } from '../../../../../helpers'
import {
  BaseDescription,
  BaseName,
  NotFoundError,
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
} from '../../../../primitives'
import { Role, type IRoleRepository } from '../domain'

export class AddRole {
  private readonly _roleRepository: IRoleRepository

  constructor(roleRepository: IRoleRepository) {
    this._roleRepository = roleRepository
  }

  async handler(id: string, name: string, description: string): Promise<void> {
    const roleName: BaseName = BaseName.create(name)

    const roleExists: boolean =
      await this._roleRepository.ensureAlreadyExists(roleName)
    if (roleExists) throw new NotFoundError('Role not found!')

    return await this._roleRepository.add(
      new Role(
        RootId.create(id),
        roleName,
        BaseDescription.create(description),
        TempoCreatedAt.create(getTemporalNow()),
        TempoUpdatedAt.create(getTemporalNow()),
        TempoDeletedAt.create(null)
      )
    )
  }
}
