import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'


type Bindings = {
  DB: D1Database
}
const app = new Hono<{Bindings: Bindings}>()

app.get('/', async (c) => {
  return c.json({ message: 'Hello World' })
})

app.get('/user/', async (c) => {
  const adapter = new PrismaD1(c.env.DB)
  const prisma = new PrismaClient({ adapter })

  const users = await prisma.user.findMany()
  return c.json(users)
})

app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app
