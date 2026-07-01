import type { IBaseRepository } from '../../../../../primitives'
import {
  AddPermission,
  EditPermission,
  FindAllPermission,
  FindOnePermission,
  RemovePermission,
  SoftRemovePermission,
} from '../../application'
import type { Permission, PermissionDto } from '../../domain'

export class PermissionShared {
  private readonly _add: AddPermission
  private readonly _edit: EditPermission
  private readonly _softRemove: SoftRemovePermission
  private readonly _remove: RemovePermission
  private readonly _findAll: FindAllPermission
  private readonly _findOne: FindOnePermission

  constructor(permissionRepository: IBaseRepository<Permission>) {
    this._add = new AddPermission(permissionRepository)
    this._edit = new EditPermission(permissionRepository)
    this._softRemove = new SoftRemovePermission(permissionRepository)
    this._remove = new RemovePermission(permissionRepository)
    this._findAll = new FindAllPermission(permissionRepository)
    this._findOne = new FindOnePermission(permissionRepository)
  }

  async add(id: string, name: string, description: string): Promise<void> {
    return await this._add.handler(id, name, description)
  }

  async edit(id: string, name: string, description: string): Promise<void> {
    return await this._edit.handler(id, name, description)
  }

  async softRemove(id: string): Promise<void> {
    return await this._softRemove.handler(id)
  }

  async remove(id: string): Promise<void> {
    return await this._remove.handler(id)
  }

  async findAll(): Promise<PermissionDto[]> {
    return await this._findAll.handler()
  }

  async findOne(id: string): Promise<PermissionDto> {
    return await this._findOne.handler(id)
  }
}
