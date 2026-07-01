import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type {
  IUserRepository,
  User,
  UserEmail,
  UserHandle,
  UserPassword,
} from '../../domain'
import { UserMapper, type UserInsert, type UserSelect } from '../services'
import { sqliteUsersTable } from '../../../../../db'
import { eq } from 'drizzle-orm'
import {
  NotFoundError,
  UnauthorizedError,
  type RootId,
} from '../../../../primitives'
import { genSalt, hash } from 'bcryptjs'
import { SALT_ROUNDS } from '../../../../../../config'
import { getTemporalNow } from '../../../../../helpers'

export class DrizzleSqliteUserRepository implements IUserRepository {
  private readonly _sqlite: LibSQLDatabase

  constructor(sqlite: LibSQLDatabase) {
    this._sqlite = sqlite
  }

  async add(user: User): Promise<void> {
    const userMapped: UserInsert = await UserMapper.mapToUserInsert(user)

    const { rowsAffected } = await this._sqlite
      .insert(sqliteUsersTable)
      .values(userMapped)

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async edit(user: User): Promise<void> {
    const userMapped: UserInsert = await UserMapper.mapToUserInsert(user)

    const { rowsAffected } = await this._sqlite
      .update(sqliteUsersTable)
      .set({
        handle: userMapped.handle,
        firstName: userMapped.firstName,
        lastName: userMapped.lastName,
        email: userMapped.email,
        avatar: userMapped.avatar,
        roleId: userMapped.roleId,
        state: userMapped.state,
        updatedAt: userMapped.updatedAt,
      })
      .where(eq(sqliteUsersTable.id, userMapped.id))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async changePassword(id: RootId, next: UserPassword): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .update(sqliteUsersTable)
      .set({
        password: await hash(next.value, await genSalt(Number(SALT_ROUNDS))),
        updatedAt: getTemporalNow().toJSON(),
      })
      .where(eq(sqliteUsersTable.id, id.value))

    if (!rowsAffected) throw new UnauthorizedError('Unauthorized user!')
  }

  async softRemove(id: RootId): Promise<void> {
    const [user] = await this._sqlite
      .select({ deletedAt: sqliteUsersTable.deletedAt })
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id.value))
    if (!user) throw new NotFoundError('User not found!')

    const { rowsAffected } = await this._sqlite
      .update(sqliteUsersTable)
      .set({
        updatedAt: getTemporalNow().toJSON(),
        deletedAt:
          typeof user.deletedAt !== 'string' ? getTemporalNow().toJSON() : null,
      })
      .where(eq(sqliteUsersTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async remove(id: RootId): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .delete(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async auth(handle: UserHandle): Promise<User | null> {
    const [user] = await this._sqlite
      .select()
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.handle, handle.value))

    return !user ? null : await UserMapper.mapToUser(user)
  }

  async findAll(): Promise<User[]> {
    const users: UserSelect[] = await this._sqlite
      .select()
      .from(sqliteUsersTable)

    return !users.length
      ? []
      : await Promise.all(
          users.map(async (user) => await UserMapper.mapToUser(user))
        )
  }

  async findOne(id: RootId): Promise<User | null> {
    const [user] = await this._sqlite
      .select()
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.id, id.value))

    return !user ? null : await UserMapper.mapToUser(user)
  }

  async ensureHandleAlreadyExists(handle: UserHandle): Promise<boolean> {
    const [user] = await this._sqlite
      .select({ handle: sqliteUsersTable.handle })
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.handle, handle.value))

    return !user ? false : true
  }

  async ensureEmailAlreadyExists(email: UserEmail): Promise<boolean> {
    const [user] = await this._sqlite
      .select({ email: sqliteUsersTable.email })
      .from(sqliteUsersTable)
      .where(eq(sqliteUsersTable.email, email.value))

    return !user ? false : true
  }
}
