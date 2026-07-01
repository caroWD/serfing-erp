import { NotFoundError, RootId } from '../../../primitives'
import { UserPassword, type IUserRepository, type User } from '../domain'

export class ChangePasswordUser {
  private readonly _userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this._userRepository = userRepository
  }

  async handler(id: string, next: string): Promise<void> {
    const userToEdit: User | null = await this._userRepository.findOne(
      RootId.create(id)
    )
    if (!userToEdit) throw new NotFoundError('User not found!')

    return await this._userRepository.changePassword(
      userToEdit.id,
      UserPassword.create(next)
    )
  }
}
