import { getTemporalNow } from '../../../../helpers'
import {
  AlreadyExistsError,
  NotFoundError,
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
} from '../../../primitives'
import type { IRoleRepository, Role } from '../../access-controls'
import {
  State,
  User,
  UserAvatar,
  UserEmail,
  UserFirstName,
  UserHandle,
  UserLastName,
  UserState,
  type IUserRepository,
} from '../domain'

export class EditUser {
  private readonly _userRepository: IUserRepository
  private readonly _roleRepository: IRoleRepository

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this._userRepository = userRepository
    this._roleRepository = roleRepository
  }

  async handler(
    id: string,
    handle: string,
    firstName: string,
    lastName: string,
    email: string,
    avatar: string | null,
    roleId: string,
    state?: 'pending' | 'enabled' | 'disabled'
  ): Promise<void> {
    const userToEdit: User | null = await this._userRepository.findOne(
      RootId.create(id)
    )
    if (!userToEdit) throw new NotFoundError('User not found!')

    const userHandle: UserHandle = UserHandle.create(handle)
    if (userHandle.value !== userToEdit.handle.value) {
      const userHandleExists: boolean =
        await this._userRepository.ensureHandleAlreadyExists(userHandle)
      if (userHandleExists)
        throw new AlreadyExistsError('Handle already exists!')
    }

    const userEmail: UserEmail = UserEmail.create(email)
    if (userEmail.value !== userToEdit.email.value) {
      const userEmailExists: boolean =
        await this._userRepository.ensureEmailAlreadyExists(userEmail)
      if (userEmailExists) throw new AlreadyExistsError('Email already exists!')
    }

    const role: Role | null = await this._roleRepository.findOne(
      RootId.create(roleId)
    )
    if (!role) throw new NotFoundError('Role not found!')

    return await this._userRepository.edit(
      new User(
        userToEdit.id,
        userHandle,
        UserFirstName.create(firstName),
        UserLastName.create(lastName),
        userEmail,
        userToEdit.password,
        UserAvatar.create(avatar),
        role.id,
        UserState.create(
          !state
            ? userToEdit.state.value
            : state === 'pending'
              ? State.PENDING
              : state === 'enabled'
                ? State.ENABLED
                : State.DISABLED
        ),
        TempoCreatedAt.create(getTemporalNow()),
        TempoUpdatedAt.create(getTemporalNow()),
        TempoDeletedAt.create(null)
      )
    )
  }
}
