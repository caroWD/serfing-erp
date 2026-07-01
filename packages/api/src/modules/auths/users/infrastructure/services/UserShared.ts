import { compare } from 'bcryptjs'
import type { IRoleRepository } from '../../../access-controls'
import {
  AddUser,
  AuthUser,
  ChangePasswordUser,
  EditUser,
  FindAllUser,
  FindOneUser,
  RemoveUser,
  SoftRemoveUser,
} from '../../application'
import type { IUserRepository, UserAuthDto, UserDto } from '../../domain'
import { NotFoundError, UnauthorizedError } from '../../../../primitives'

export class UserShared {
  private readonly _add: AddUser
  private readonly _auth: AuthUser
  private readonly _editPassword: ChangePasswordUser
  private readonly _edit: EditUser
  private readonly _findAll: FindAllUser
  private readonly _findOne: FindOneUser
  private readonly _remove: RemoveUser
  private readonly _softRemove: SoftRemoveUser

  constructor(
    userRepository: IUserRepository,
    roleRepository: IRoleRepository
  ) {
    this._add = new AddUser(userRepository, roleRepository)
    this._auth = new AuthUser(userRepository, roleRepository)
    this._edit = new EditUser(userRepository, roleRepository)
    this._editPassword = new ChangePasswordUser(userRepository)
    this._findAll = new FindAllUser(userRepository, roleRepository)
    this._findOne = new FindOneUser(userRepository, roleRepository)
    this._remove = new RemoveUser(userRepository)
    this._softRemove = new SoftRemoveUser(userRepository)
  }

  async add(
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
    return await this._add.handler(
      id,
      handle,
      firstName,
      lastName,
      email,
      password,
      avatar,
      roleId,
      state
    )
  }

  async auth(handle: string, password: string): Promise<UserAuthDto> {
    const user: UserAuthDto = await this._auth.handler(handle)

    if (!(await compare(password, user.password)) || !user.state)
      throw new UnauthorizedError('Unauthorized user!')

    return user
  }

  async changePassword(
    id: string,
    current: string,
    next: string
  ): Promise<void> {
    const user: UserDto | null = await this._findOne.handler(id)
    if (!user) throw new NotFoundError('User not found!')

    const userAuth: UserAuthDto | null = await this._auth.handler(user.handle)
    if (!userAuth) throw new NotFoundError('User not found!')

    if (!(await compare(current, userAuth.password)))
      throw new UnauthorizedError('Unauthorized user!')

    return await this._editPassword.handler(id, next)
  }

  async edit(
    id: string,
    handle: string,
    firstName: string,
    lastName: string,
    email: string,
    avatar: string | null,
    roleId: string,
    state?: 'pending' | 'enabled' | 'disabled'
  ): Promise<void> {
    return await this._edit.handler(
      id,
      handle,
      firstName,
      lastName,
      email,
      avatar,
      roleId,
      state
    )
  }

  async findAll(): Promise<UserDto[]> {
    return await this._findAll.handler()
  }

  async findOne(id: string): Promise<UserDto> {
    return await this._findOne.handler(id)
  }

  async remove(id: string): Promise<void> {
    return await this._remove.handler(id)
  }

  async softRemove(id: string): Promise<void> {
    return await this._softRemove.handler(id)
  }
}
