import { NotFoundError, RootId } from '../../../primitives'
import type { IUserRepository, User } from '../domain'

export class SoftRemoveUser {
  private readonly _userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository
  }

  async handler(id: string): Promise<void> {
    const userToToggle: User | null = await this._userRepository.findOne(
      RootId.create(id)
    )
    if (!userToToggle) throw new NotFoundError('User not found!')

    return await this._userRepository.softRemove(userToToggle.id)
  }
}
