import type { IBaseRepository } from '../../../../../primitives'
import type { Permission, PermissionDto } from '../../../permissions'
import {
  AddPermissionToRole,
  AddRole,
  EditRole,
  FindAllRole,
  FindOneRole,
  FindPermissionsForRole,
  RemovePermissionToRole,
  RemoveRole,
  SoftRemoveRole,
} from '../../application'
import type { IRoleRepository, RoleDto } from '../../domain'

export class RoleShared {
  private readonly _add: AddRole
  private readonly _addPermission: AddPermissionToRole
  private readonly _edit: EditRole
  private readonly _softRemove: SoftRemoveRole
  private readonly _remove: RemoveRole
  private readonly _removePermission: RemovePermissionToRole
  private readonly _findAll: FindAllRole
  private readonly _findOne: FindOneRole
  private readonly _findPermissions: FindPermissionsForRole

  constructor(
    roleRepository: IRoleRepository,
    permissionRepository: IBaseRepository<Permission>
  ) {
    this._add = new AddRole(roleRepository)
    this._addPermission = new AddPermissionToRole(
      roleRepository,
      permissionRepository
    )
    this._edit = new EditRole(roleRepository)
    this._softRemove = new SoftRemoveRole(roleRepository)
    this._remove = new RemoveRole(roleRepository)
    this._removePermission = new RemovePermissionToRole(
      roleRepository,
      permissionRepository
    )
    this._findAll = new FindAllRole(roleRepository)
    this._findOne = new FindOneRole(roleRepository)
    this._findPermissions = new FindPermissionsForRole(roleRepository)
  }

  async add(id: string, name: string, description: string): Promise<void> {
    return await this._add.handler(id, name, description)
  }

  async addPermission(roleId: string, permissionId: string): Promise<void> {
    return await this._addPermission.handler(roleId, permissionId)
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

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    return await this._removePermission.handler(roleId, permissionId)
  }

  async findAll(): Promise<RoleDto[]> {
    return await this._findAll.handler()
  }

  async findOne(id: string): Promise<RoleDto> {
    return await this._findOne.handler(id)
  }

  async findPermissions(roleId: string): Promise<PermissionDto[]> {
    return await this._findPermissions.handler(roleId)
  }
}
