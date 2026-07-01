import type { Request, Response, NextFunction } from 'express'
import {
  addUserRequestSchema,
  authUserRequestSchema,
  changePasswordUserRequestSchema,
  editUserRequestSchema,
  type AddUserRequest,
  type AuthUserRequest,
  type ChangePasswordUserRequest,
  type EditUserRequest,
} from './services'
import type { AuthResponse, BaseResponse } from '../../../../types'
import { serviceContainer } from '../../../../shared/service-container'
import type { UserAuthDto, UserDto } from '../domain'
import { SignJWT } from 'jose'
import {
  JWT_ALG,
  JWT_CLAIM,
  JWT_ISSUER,
  JWT_SECRET,
  NODE_ENV,
  USER_ADMIN_ROLE,
} from '../../../../../config'
import { idRequestSchema, type IdRequest } from '../../../primitives'

export class UserController {
  async add(
    req: Request<AddUserRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const {
        id,
        handle,
        firstName,
        lastName,
        email,
        password,
        avatar,
        roleId,
        state,
      } = await addUserRequestSchema.parseAsync(req.body)

      await serviceContainer.auth.user.add(
        id,
        handle,
        firstName,
        lastName,
        email,
        password,
        !avatar ? null : avatar,
        !roleId ? USER_ADMIN_ROLE : roleId,
        state
      )

      res.status(201).json({ message: 'User added successfully!', state: true })
      return
    } catch (error) {
      next(error)
    }
  }

  async auth(
    req: Request<AuthUserRequest>,
    res: Response<AuthResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { handle, password } = await authUserRequestSchema.parseAsync(
        req.body
      )

      const user: UserAuthDto = await serviceContainer.auth.user.auth(
        handle,
        password
      )

      const token = await new SignJWT({
        [JWT_CLAIM]: true,
        id: user.id,
        handle: user.handle,
        fullName: user.fullName,
        email: user.emial,
        roleId: user.roleId,
        roleName: user.roleName,
        isAdmin: ['system:admin', 'system:support'].includes(user.roleName),
      })
        .setProtectedHeader({ alg: JWT_ALG })
        .setIssuedAt()
        .setIssuer(JWT_ISSUER)
        .setAudience(user.id)
        .setExpirationTime('1h')
        .sign(new TextEncoder().encode(JWT_SECRET))

      res
        .status(200)
        .cookie('access_token', token, {
          httpOnly: true,
          secure: NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 1000 * 60 * 60,
        })
        .json({ message: 'Authorized user!', state: true, token })

      return
    } catch (error) {
      next(error)
    }
  }

  async changePassword(
    req: Request<ChangePasswordUserRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, current, next } =
        await changePasswordUserRequestSchema.parseAsync(req.body)

      await serviceContainer.auth.user.changePassword(id, current, next)

      res
        .status(200)
        .json({ message: 'User password changed successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async edit(
    req: Request<EditUserRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, handle, firstName, lastName, email, avatar, roleId, state } =
        await editUserRequestSchema.parseAsync(req.body)

      await serviceContainer.auth.user.edit(
        id,
        handle,
        firstName,
        lastName,
        email,
        !avatar ? null : avatar,
        !roleId ? USER_ADMIN_ROLE : roleId,
        state
      )

      res
        .status(200)
        .json({ message: 'User edited successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<UserDto[] | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const users: UserDto[] = await serviceContainer.auth.user.findAll()

      res.status(200).json(users)
      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<UserDto | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.params)

      const user: UserDto = await serviceContainer.auth.user.findOne(id)

      res.status(200).json(user)

      return
    } catch (error) {
      next(error)
    }
  }

  async remove(
    req: Request<IdRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.body)

      await serviceContainer.auth.user.remove(id)

      res
        .status(200)
        .json({ message: 'User removed successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async softRemove(
    req: Request<IdRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.body)

      await serviceContainer.auth.user.softRemove(id)

      res
        .status(200)
        .json({ message: 'User soft-removed successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }
}
