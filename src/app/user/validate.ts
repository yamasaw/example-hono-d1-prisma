import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  kana: z.string(),
})

export const validate = zValidator('json', UserSchema)