import { NotFoundError, RootId } from '../../../primitives'
import type { IRoleRepository, Role } from '../../access-controls'
import { State, UserDto, type IUserRepository, type User } from '../domain'

export class FindOneUser {
  private readonly _userRepository: IUserRepository
  private readonly _roleRepository: IRoleRepository

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this._userRepository = userRepository
    this._roleRepository = roleRepository
  }

  async handler(id: string): Promise<UserDto> {
    const userFinded: User | null = await this._userRepository.findOne(
      RootId.create(id)
    )
    if (!userFinded) throw new NotFoundError('User not found!')

    const role: Role | null = await this._roleRepository.findOne(
      userFinded.roleId
    )
    if (!role) throw new NotFoundError('Role not found!')

    return new UserDto(
      userFinded.id.value,
      userFinded.handle.value,
      userFinded.firstName.value,
      userFinded.lastName.value,
      userFinded.fullName,
      userFinded.email.value,
      userFinded.avatar.value,
      role.id.value,
      role.name.value,
      userFinded.state.value === State.PENDING
        ? 'pending'
        : userFinded.state.value === State.ENABLED
          ? 'enabled'
          : 'disabled',
      userFinded.createdAt.value.toJSON(),
      userFinded.updatedAt.value.toJSON(),
      userFinded.deletedAt.value?.toJSON() || null
    )
  }
}
