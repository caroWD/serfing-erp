import type { Request, Response, NextFunction } from 'express'
import {
  baseRequestSchema,
  idRequestSchema,
  type BaseRequest,
  type IdRequest,
} from '../../../../primitives'
import type { BaseResponse } from '../../../../../types'
import { serviceContainer } from '../../../../../shared/service-container'
import {
  rolePermissionRequesSchema,
  type RolePermissionRequest,
} from './services'
import {
  RoleAlreadyHasThatPermissionError,
  RoleDoesNotHaveThatPermissionError,
  RoleDto,
} from '../domain'
import type { PermissionDto } from '../../permissions'

export class RoleController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, name, description } = await baseRequestSchema.parseAsync(
        req.body
      )

      await serviceContainer.auth.accessControl.role.add(id, name, description)

      res.status(201).json({ message: 'Role added successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async addPermission(
    req: Request<RolePermissionRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roleId, permissionId } =
        await rolePermissionRequesSchema.parseAsync(req.body)

      await serviceContainer.auth.accessControl.role.addPermission(
        roleId,
        permissionId
      )

      res
        .status(201)
        .json({ message: 'RolePermission added successfully!', state: true })

      return
    } catch (error) {
      if (error instanceof RoleAlreadyHasThatPermissionError)
        res.status(422).json({ message: error.message, state: false })

      next(error)
    }
  }

  async edit(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, name, description } = await baseRequestSchema.parseAsync(
        req.body
      )

      await serviceContainer.auth.accessControl.role.edit(id, name, description)

      res
        .status(200)
        .json({ message: 'Role edited successfully!', state: true })

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

      await serviceContainer.auth.accessControl.role.softRemove(id)

      res
        .status(200)
        .json({ message: 'Role soft-remove successfully!', state: true })

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

      await serviceContainer.auth.accessControl.role.remove(id)

      res
        .status(200)
        .json({ message: 'Role toogle archived successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async removePermission(
    req: Request<RolePermissionRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { roleId, permissionId } =
        await rolePermissionRequesSchema.parseAsync(req.body)

      await serviceContainer.auth.accessControl.role.removePermission(
        roleId,
        permissionId
      )

      res
        .status(200)
        .json({ message: 'RolePermission removed successfully!', state: true })

      return
    } catch (error) {
      if (error instanceof RoleDoesNotHaveThatPermissionError)
        res.status(404).json({ message: error.message, state: false })

      if (error instanceof RoleAlreadyHasThatPermissionError)
        res.status(422).json({ message: error.message, state: false })

      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<RoleDto[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const roles: RoleDto[] =
        await serviceContainer.auth.accessControl.role.findAll()

      res.status(200).json(roles)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<RoleDto | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.params)

      const role: RoleDto =
        await serviceContainer.auth.accessControl.role.findOne(id)

      res.status(200).json(role)

      return
    } catch (error) {
      next(error)
    }
  }

  async findPermissions(
    req: Request<IdRequest>,
    res: Response<PermissionDto[] | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.params)

      const permissions: PermissionDto[] =
        await serviceContainer.auth.accessControl.role.findPermissions(id)

      res.status(200).json(permissions)

      return
    } catch (error) {
      next(error)
    }
  }
}
