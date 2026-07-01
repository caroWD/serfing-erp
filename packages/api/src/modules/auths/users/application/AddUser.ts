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
  UserPassword,
  UserState,
  type IUserRepository,
} from '../domain'

export class AddUser {
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
    password: string,
    avatar: string | null,
    roleId: string,
    state?: 'pending' | 'enabled' | 'disabled'
  ): Promise<void> {
    const userHandle: UserHandle = UserHandle.create(handle)
    const userHandleExists: boolean =
      await this._userRepository.ensureHandleAlreadyExists(userHandle)
    if (userHandleExists) throw new AlreadyExistsError('Handle already exists!')

    const userEmail: UserEmail = UserEmail.create(email)
    const userEmailExists: boolean =
      await this._userRepository.ensureEmailAlreadyExists(userEmail)
    if (userEmailExists) throw new AlreadyExistsError('Email already exists!')

    const role: Role | null = await this._roleRepository.findOne(
      RootId.create(roleId)
    )
    if (!role) throw new NotFoundError('Role not found!')

    return await this._userRepository.add(
      new User(
        RootId.create(id),
        userHandle,
        UserFirstName.create(firstName),
        UserLastName.create(lastName),
        userEmail,
        UserPassword.create(password),
        UserAvatar.create(avatar),
        role.id,
        UserState.create(
          !state || state === 'pending'
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
