import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import type { IRoleRepository, Role } from '../../domain'
import {
  BaseName,
  NotFoundError,
  type BaseInsert,
  type BaseSelect,
  type RootId,
} from '../../../../../primitives'
import {
  sqlitePermissionsTable,
  sqliteRolePermissionsTable,
  sqliteRolesTable,
} from '../../../../../../db'
import { and, eq } from 'drizzle-orm'
import { PermissionMapper, type Permission } from '../../../permissions'
import { RoleMapper } from '../services'
import { getTemporalNow } from '../../../../../../helpers'

export class DrizzleSqliteRoleRepository implements IRoleRepository {
  private readonly _sqlite: LibSQLDatabase

  constructor(sqlite: LibSQLDatabase) {
    this._sqlite = sqlite
  }

  async addPermissionToRole(
    roleId: RootId,
    permissionId: RootId
  ): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .insert(sqliteRolePermissionsTable)
      .values({ roleId: roleId.value, permissionId: permissionId.value })

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async removePermissionToRole(
    roleId: RootId,
    permissionId: RootId
  ): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .delete(sqliteRolePermissionsTable)
      .where(
        and(
          eq(sqliteRolePermissionsTable.roleId, roleId.value),
          eq(sqliteRolePermissionsTable.permissionId, permissionId.value)
        )
      )

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async findPermissionsForRole(roleId: RootId): Promise<Permission[]> {
    const permissions = (
      await this._sqlite
        .select()
        .from(sqliteRolePermissionsTable)
        .where(eq(sqliteRolePermissionsTable.roleId, roleId.value))
        .innerJoin(
          sqlitePermissionsTable,
          eq(sqliteRolePermissionsTable.permissionId, sqlitePermissionsTable.id)
        )
    ).map((result) => result.permissions)

    return !permissions.length
      ? []
      : await Promise.all(
          permissions.map(
            async (permission) =>
              await PermissionMapper.mapToPermission(permission)
          )
        )
  }

  async ensureRoleHasThisPermission(
    roleId: RootId,
    permissionId: RootId
  ): Promise<boolean> {
    const [rolePermission] = await this._sqlite
      .select()
      .from(sqliteRolePermissionsTable)
      .where(
        and(
          eq(sqliteRolePermissionsTable.roleId, roleId.value),
          eq(sqliteRolePermissionsTable.permissionId, permissionId.value)
        )
      )

    return !rolePermission ? false : true
  }

  async add(entity: Role): Promise<void> {
    const roleMapped: BaseInsert = await RoleMapper.mapToRoleInsert(entity)

    const { rowsAffected } = await this._sqlite
      .insert(sqliteRolesTable)
      .values(roleMapped)

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async edit(entity: Role): Promise<void> {
    const roleMapped: BaseInsert = await RoleMapper.mapToRoleInsert(entity)

    const { rowsAffected } = await this._sqlite
      .update(sqliteRolesTable)
      .set({
        name: roleMapped.name,
        description: roleMapped.description,
        updatedAt: roleMapped.updatedAt,
      })
      .where(eq(sqliteRolesTable.id, roleMapped.id))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async softRemove(id: RootId): Promise<void> {
    const [role] = await this._sqlite
      .select({ deletedAt: sqliteRolesTable.deletedAt })
      .from(sqliteRolesTable)
      .where(eq(sqliteRolesTable.id, id.value))
    if (!role) throw new NotFoundError('Role not found!')

    const { rowsAffected } = await this._sqlite
      .update(sqliteRolesTable)
      .set({
        updatedAt: getTemporalNow().toJSON(),
        deletedAt:
          typeof role.deletedAt !== 'string' ? getTemporalNow().toJSON() : null,
      })
      .where(eq(sqliteRolesTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async remove(id: RootId): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .delete(sqliteRolesTable)
      .where(eq(sqliteRolesTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async findAll(): Promise<Role[]> {
    const roles: BaseSelect[] = await this._sqlite
      .select()
      .from(sqliteRolesTable)

    return !roles.length
      ? []
      : await Promise.all(
          roles.map(async (role) => await RoleMapper.mapToRole(role))
        )
  }

  async findOne(id: RootId): Promise<Role | null> {
    const [roleFinded] = await this._sqlite
      .select()
      .from(sqliteRolesTable)
      .where(eq(sqliteRolesTable.id, id.value))

    return !roleFinded ? null : await RoleMapper.mapToRole(roleFinded)
  }

  async ensureAlreadyExists(name: BaseName): Promise<boolean> {
    const [roleExists] = await this._sqlite
      .select({ name: sqliteRolesTable.name })
      .from(sqliteRolesTable)
      .where(eq(sqliteRolesTable.name, name.value))

    return !roleExists ? false : true
  }
}
