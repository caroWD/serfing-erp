import type { LibSQLDatabase } from 'drizzle-orm/libsql'
import {
  BaseName,
  NotFoundError,
  type BaseInsert,
  type BaseSelect,
  type IBaseRepository,
  type RootId,
} from '../../../../../primitives'
import type { Permission } from '../../domain'
import { PermissionMapper } from '../services'
import { sqlitePermissionsTable } from '../../../../../../db'
import { eq } from 'drizzle-orm'
import { getTemporalNow } from '../../../../../../helpers'

export class DrizzleSqlitePermissionRepository implements IBaseRepository<Permission> {
  private readonly _sqlite: LibSQLDatabase

  constructor(sqlite: LibSQLDatabase) {
    this._sqlite = sqlite
  }

  async add(entity: Permission): Promise<void> {
    const permissionMapped: BaseInsert =
      await PermissionMapper.mapToPermissionInsert(entity)

    const { rowsAffected } = await this._sqlite
      .insert(sqlitePermissionsTable)
      .values(permissionMapped)

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async edit(entity: Permission): Promise<void> {
    const permissionMapped: BaseInsert =
      await PermissionMapper.mapToPermissionInsert(entity)

    const { rowsAffected } = await this._sqlite
      .update(sqlitePermissionsTable)
      .set({
        name: permissionMapped.name,
        description: permissionMapped.description,
        updatedAt: permissionMapped.updatedAt,
      })
      .where(eq(sqlitePermissionsTable.id, permissionMapped.id))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async softRemove(id: RootId): Promise<void> {
    const [permission] = await this._sqlite
      .select({ deletedAt: sqlitePermissionsTable.deletedAt })
      .from(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.id, id.value))
    if (!permission) throw new NotFoundError('Permission not found!')

    const { rowsAffected } = await this._sqlite
      .update(sqlitePermissionsTable)
      .set({
        updatedAt: getTemporalNow().toJSON(),
        deletedAt:
          typeof permission.deletedAt !== 'string'
            ? getTemporalNow().toJSON()
            : null,
      })
      .where(eq(sqlitePermissionsTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }
  async remove(id: RootId): Promise<void> {
    const { rowsAffected } = await this._sqlite
      .delete(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.id, id.value))

    if (!rowsAffected)
      throw new Error('Something went wrong! Please contact the administrator.')
  }

  async findAll(): Promise<Permission[]> {
    const permissions: BaseSelect[] = await this._sqlite
      .select()
      .from(sqlitePermissionsTable)

    return !permissions.length
      ? []
      : await Promise.all(
          permissions.map(
            async (permission) =>
              await PermissionMapper.mapToPermission(permission)
          )
        )
  }

  async findOne(id: RootId): Promise<Permission | null> {
    const [permission] = await this._sqlite
      .select()
      .from(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.id, id.value))

    return !permission
      ? null
      : await PermissionMapper.mapToPermission(permission)
  }

  async ensureAlreadyExists(name: BaseName): Promise<boolean> {
    const [permission] = await this._sqlite
      .select({ name: sqlitePermissionsTable.name })
      .from(sqlitePermissionsTable)
      .where(eq(sqlitePermissionsTable.name, name.value))

    return !permission ? false : true
  }
}
