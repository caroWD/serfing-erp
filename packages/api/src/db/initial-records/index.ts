import { sqlite } from '../../config'
import {
  sqlitePermissionsTable,
  sqliteRolePermissionsTable,
  sqliteRolesTable,
  sqliteUsersTable,
} from '../sqlite-schema'
import {
  sqlitePermissionsInitial,
  sqliteRolePermissionsInitial,
  sqliteRolesInitial,
  sqliteUsersInitial,
} from './sqlite'

const initalRecords = async (): Promise<void> => {
  await sqlite.insert(sqlitePermissionsTable).values(sqlitePermissionsInitial)

  await sqlite.insert(sqliteRolesTable).values(sqliteRolesInitial)

  await sqlite
    .insert(sqliteRolePermissionsTable)
    .values(sqliteRolePermissionsInitial)

  await sqlite.insert(sqliteUsersTable).values(sqliteUsersInitial)
}

initalRecords()

export * from './sqlite'
