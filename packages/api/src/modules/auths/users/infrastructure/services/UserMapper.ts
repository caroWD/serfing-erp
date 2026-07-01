import { genSalt, hash } from 'bcryptjs'
import { getTemporalFrom } from '../../../../../helpers'
import {
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
} from '../../../../primitives'
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
} from '../../domain'
import type { UserInsert, UserSelect } from './user-schema'
import { SALT_ROUNDS } from '../../../../../../config'

export class UserMapper {
  public static async mapToUser(user: UserSelect): Promise<User> {
    return new User(
      RootId.create(user.id),
      UserHandle.create(user.handle),
      UserFirstName.create(user.firstName),
      UserLastName.create(user.lastName),
      UserEmail.create(user.email),
      UserPassword.create(user.password),
      UserAvatar.create(user.avatar),
      RootId.create(user.roleId),
      UserState.create(
        user.state === 'pending'
          ? State.PENDING
          : user.state === 'enabled'
            ? State.ENABLED
            : State.DISABLED
      ),
      TempoCreatedAt.create(getTemporalFrom(user.createdAt)),
      TempoUpdatedAt.create(getTemporalFrom(user.updatedAt)),
      TempoDeletedAt.create(
        !user.deletedAt ? null : getTemporalFrom(user.deletedAt)
      )
    )
  }

  public static async mapToUserInsert(user: User): Promise<UserInsert> {
    return {
      id: user.id.value,
      handle: user.handle.value,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value,
      password: await hash(
        user.password.value,
        await genSalt(Number(SALT_ROUNDS))
      ),
      avatar: user.avatar.value,
      roleId: user.roleId.value,
      state:
        user.state.value === State.PENDING
          ? 'pending'
          : user.state.value === State.ENABLED
            ? 'enabled'
            : 'disabled',
      createdAt: user.createdAt.value.toJSON(),
      updatedAt: user.updatedAt.value.toJSON(),
      deletedAt: user.deletedAt.value?.toJSON() || null,
    }
  }
}
