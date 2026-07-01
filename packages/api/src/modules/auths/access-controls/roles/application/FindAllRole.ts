import { RoleDto, type IRoleRepository, type Role } from '../domain'

export class FindAllRole {
  private readonly _roleRepository: IRoleRepository

  constructor(roleRepository: IRoleRepository) {
    this._roleRepository = roleRepository
  }

  async handler(): Promise<RoleDto[]> {
    const roles: Role[] = await this._roleRepository.findAll()

    return !roles.length
      ? []
      : roles.map(
          (role) =>
            new RoleDto(
              role.id.value,
              role.name.value,
              role.description.value,
              role.createdAt.value.toJSON(),
              role.updatedAt.value.toJSON(),
              role.deletedAt.value?.toJSON() || null
            )
        )
  }
}
