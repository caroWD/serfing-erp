import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { getTemporalNow } from '../helpers'

export const sqlitePermissionsTable = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull().default(getTemporalNow().toJSON()),
  updatedAt: text('updated_at').notNull().default(getTemporalNow().toJSON()),
  deletedAt: text('deleted_at')
    .$type<string | null>()
    .$onUpdate(() => null),
})

export const sqliteRolesTable = sqliteTable('roles', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull().default(getTemporalNow().toJSON()),
  updatedAt: text('updated_at').notNull().default(getTemporalNow().toJSON()),
  deletedAt: text('deleted_at')
    .$type<string | null>()
    .$onUpdate(() => null),
})

export const sqliteRolePermissionsTable = sqliteTable(
  'role_permissions',
  {
    roleId: text('role_id')
      .notNull()
      .references(() => sqliteRolesTable.id),
    permissionId: text('permission_id')
      .notNull()
      .references(() => sqlitePermissionsTable.id),
  },
  (table) => [
    primaryKey({
      name: 'pk_role_permissions',
      columns: [table.roleId, table.permissionId],
    }),
  ]
)

export const sqliteUsersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  avatar: text('avatar')
    .$type<string | null>()
    .$onUpdate(() => null),
  roleId: text('role_id')
    .notNull()
    .references(() => sqliteRolesTable.id),
  state: text('state', { enum: ['pending', 'enabled', 'disabled'] })
    .notNull()
    .default('pending'),
  createdAt: text('created_at').notNull().default(getTemporalNow().toJSON()),
  updatedAt: text('updated_at').notNull().default(getTemporalNow().toJSON()),
  deletedAt: text('deleted_at')
    .$type<string | null>()
    .$onUpdate(() => null),
})
