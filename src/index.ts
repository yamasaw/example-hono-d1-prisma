import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'


type Bindings = {
  DB: D1Database
}
const app = new Hono<{Bindings: Bindings}>()

const client = function () {
  let  client: PrismaClient
  return function (adapter?: PrismaD1) {
    if (!client) {
      if (!adapter) {
        throw new Error('Adapter is not provided')
      }
      client = new PrismaClient({ adapter })
    }
    return client
  }
}()

// ミドルウェアでDBをバインド
app.use('*', async (c, next) => {
  const adapter = new PrismaD1(c.env.DB)
  client(adapter)
  await next()
})

app.get('/', async (c) => {
  return c.json({ message: 'Hello World' })
})

app.get('/user/', async (c) => {
  const users = await client().user.findMany()
  return c.json(users)
})

app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app
