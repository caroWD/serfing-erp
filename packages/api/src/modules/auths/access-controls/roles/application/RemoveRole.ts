import { NotFoundError, RootId } from '../../../../primitives'
import type { IRoleRepository, Role } from '../domain'

export class RemoveRole {
  private readonly _roleRepository: IRoleRepository

  constructor(roleRepository: IRoleRepository) {
    this._roleRepository = roleRepository
  }

  async handler(id: string): Promise<void> {
    const roleToRemove: Role | null = await this._roleRepository.findOne(
      RootId.create(id)
    )
    if (!roleToRemove) throw new NotFoundError('Role not found!')

    return await this._roleRepository.remove(roleToRemove.id)
  }
}
