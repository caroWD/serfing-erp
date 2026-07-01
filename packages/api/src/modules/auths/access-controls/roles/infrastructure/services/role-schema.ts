import * as z from 'zod'

export const rolePermissionRequesSchema = z.object({
  roleId: z.uuidv7({ error: 'The RoleId must be in UUIDv7 format.' }),
  permissionId: z.uuid({ error: 'The PermissionId must be in UUIDv7 format.' }),
})

export type RolePermissionRequest = z.infer<typeof rolePermissionRequesSchema>
