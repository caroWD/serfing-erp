import type { Request, Response, NextFunction } from 'express'
import {
  baseRequestSchema,
  idRequestSchema,
  type BaseRequest,
  type IdRequest,
} from '../../../../primitives'
import type { BaseResponse } from '../../../../../types'
import { serviceContainer } from '../../../../../shared/service-container'
import type { PermissionDto } from '../domain'

export class PermissionController {
  async add(
    req: Request<BaseRequest>,
    res: Response<BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id, name, description } = await baseRequestSchema.parseAsync(
        req.body
      )

      await serviceContainer.auth.accessControl.permission.add(
        id,
        name,
        description
      )

      res
        .status(201)
        .json({ message: 'Permission added successfully!', state: true })

      return
    } catch (error) {
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

      await serviceContainer.auth.accessControl.permission.edit(
        id,
        name,
        description
      )

      res
        .status(200)
        .json({ message: 'Permission edited successfully!', state: true })

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

      await serviceContainer.auth.accessControl.permission.softRemove(id)

      res
        .status(200)
        .json({ message: 'Permission soft-removed successfully!', state: true })

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

      await serviceContainer.auth.accessControl.permission.remove(id)

      res
        .status(200)
        .json({ message: 'Permission removed successfully!', state: true })

      return
    } catch (error) {
      next(error)
    }
  }

  async findAll(
    _req: Request,
    res: Response<PermissionDto[]>,
    next: NextFunction
  ): Promise<void> {
    try {
      const permissions: PermissionDto[] =
        await serviceContainer.auth.accessControl.permission.findAll()

      res.status(200).json(permissions)

      return
    } catch (error) {
      next(error)
    }
  }

  async findOne(
    req: Request<IdRequest>,
    res: Response<PermissionDto | BaseResponse>,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = await idRequestSchema.parseAsync(req.params)

      const permission: PermissionDto =
        await serviceContainer.auth.accessControl.permission.findOne(id)

      res.status(200).json(permission)

      return
    } catch (error) {
      next(error)
    }
  }
}
