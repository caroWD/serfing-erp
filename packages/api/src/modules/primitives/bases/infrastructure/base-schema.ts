import * as z from 'zod'
import { rootSchema } from '../../roots'

export const baseSelectSchema = rootSchema.extend({
  name: z
    .string({ error: 'The Name must be a string.' })
    .min(5, { error: 'The Name must be at least 5 characters long.' })
    .max(50, { error: 'The Name must be no more than 50 characters long.' }),
  description: z
    .string({ error: 'The Description must be a string.' })
    .min(15, { error: 'The Description must be at least 15 characters long.' })
    .max(200, {
      error: 'The Description must be no more than 200 characters long.',
    }),
})

export type BaseSelect = z.infer<typeof baseSelectSchema>

export const baseInsertSchema = baseSelectSchema.partial({
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
})

export type BaseInsert = z.infer<typeof baseInsertSchema>

export const baseRequestSchema = baseSelectSchema.pick({
  id: true,
  name: true,
  description: true,
})

export type BaseRequest = z.infer<typeof baseRequestSchema>

export const idRequestSchema = baseRequestSchema.pick({ id: true })

export type IdRequest = z.infer<typeof idRequestSchema>
