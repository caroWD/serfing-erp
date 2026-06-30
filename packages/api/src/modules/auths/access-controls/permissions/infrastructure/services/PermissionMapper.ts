import { getTemporalFrom } from '../../../../../../helpers'
import {
  BaseDescription,
  BaseName,
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
  type BaseInsert,
  type BaseSelect,
} from '../../../../../primitives'
import { Permission } from '../../domain'

export class PermissionMapper {
  public static async mapToPermission(
    permission: BaseSelect
  ): Promise<Permission> {
    return new Permission(
      RootId.create(permission.id),
      BaseName.create(permission.name),
      BaseDescription.create(permission.description),
      TempoCreatedAt.create(getTemporalFrom(permission.createdAt)),
      TempoUpdatedAt.create(getTemporalFrom(permission.updatedAt)),
      TempoDeletedAt.create(
        !permission.deletedAt ? null : getTemporalFrom(permission.deletedAt)
      )
    )
  }

  public static async mapToPermissionInsert(
    permission: Permission
  ): Promise<BaseInsert> {
    return {
      id: permission.id.value,
      name: permission.name.value,
      description: permission.description.value,
      createdAt: permission.createdAt.value.toJSON(),
      updatedAt: permission.updatedAt.value.toJSON(),
      deletedAt: !permission.deletedAt.value
        ? null
        : permission.deletedAt.value.toJSON(),
    }
  }
}
