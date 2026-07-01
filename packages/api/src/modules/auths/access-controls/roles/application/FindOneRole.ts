import { NotFoundError, RootId } from '../../../../primitives'
import { RoleDto, type IRoleRepository, type Role } from '../domain'

export class FindOneRole {
  private readonly _roleRepository: IRoleRepository

  constructor(roleRepository: IRoleRepository) {
    this._roleRepository = roleRepository
  }

  async handler(id: string): Promise<RoleDto> {
    const roleFinded: Role | null = await this._roleRepository.findOne(
      RootId.create(id)
    )
    if (!roleFinded) throw new NotFoundError('Role not found!')

    return new RoleDto(
      roleFinded.id.value,
      roleFinded.name.value,
      roleFinded.description.value,
      roleFinded.createdAt.value.toJSON(),
      roleFinded.updatedAt.value.toJSON(),
      roleFinded.deletedAt.value?.toJSON() || null
    )
  }
}
