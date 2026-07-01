import { NotFoundError, RootId } from '../../../primitives'
import type { IUserRepository, User } from '../domain'

export class RemoveUser {
  private readonly _userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository
  }

  async handler(id: string): Promise<void> {
    const userToRemove: User | null = await this._userRepository.findOne(
      RootId.create(id)
    )
    if (!userToRemove) throw new NotFoundError('User not found!')

    return await this._userRepository.remove(userToRemove.id)
  }
}
