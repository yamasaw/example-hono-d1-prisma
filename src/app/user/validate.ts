import { validator } from 'hono/validator'
import { z } from 'zod'

export const UserSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  kana: z.string(),
})

export const validate = validator('json', async (value, c) => {
  const parsed = UserSchema.safeParse(value)

  if (!parsed.success) {
    const messages: string[] = []
    parsed.error?.errors.forEach((error) => {
      messages.push(error.message)
    })
    return c.json(messages, 400)
  }
  return parsed.data
})