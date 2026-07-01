import { NotFoundError } from '../../../primitives'
import type { IRoleRepository, Role } from '../../access-controls'
import { State, User, UserDto, type IUserRepository } from '../domain'

export class FindAllUser {
  private readonly _userRepository: IUserRepository
  private readonly _roleRepository: IRoleRepository

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this._userRepository = userRepository
    this._roleRepository = roleRepository
  }

  async handler(): Promise<UserDto[]> {
    const users: User[] = await this._userRepository.findAll()

    return !users.length
      ? []
      : await Promise.all(
          users.map(async (user) => {
            const role: Role | null = await this._roleRepository.findOne(
              user.roleId
            )
            if (!role) throw new NotFoundError('Role not found!')

            return new UserDto(
              user.id.value,
              user.handle.value,
              user.firstName.value,
              user.lastName.value,
              user.fullName,
              user.email.value,
              user.avatar.value,
              role.id.value,
              role.name.value,
              user.state.value === State.PENDING
                ? 'pending'
                : user.state.value === State.ENABLED
                  ? 'enabled'
                  : 'disabled',
              user.createdAt.value.toJSON(),
              user.updatedAt.value.toJSON(),
              user.deletedAt.value?.toJSON() || null
            )
          })
        )
  }
}
