import type { RootId } from '../../../primitives'
import type { User } from './models'
import type { UserEmail, UserHandle, UserPassword } from './value-objects'

export interface IUserRepository {
  add(user: User): Promise<void>

  edit(user: User): Promise<void>

  changePassword(id: RootId, next: UserPassword): Promise<void>

  softRemove(id: RootId): Promise<void>

  remove(id: RootId): Promise<void>

  auth(handle: UserHandle): Promise<User | null>

  findAll(): Promise<User[]>

  findOne(id: RootId): Promise<User | null>

  ensureHandleAlreadyExists(handle: UserHandle): Promise<boolean>

  ensureEmailAlreadyExists(email: UserEmail): Promise<boolean>
}
