import { Hono } from 'hono'
import { client } from "@/utils/prisma"

type Bindings = {
  DB: D1Database
}
const app = new Hono<{Bindings: Bindings}>()

// ミドルウェアでDBをバインド
app.use('*', async (c, next) => {
  client(c.env.DB)
  await next()
})

app.get('/', async (c) => {
  return c.json({ message: 'Hello World' })
})

app.get('/user/', async (c) => {
  const users = await client().user.findMany()
  return c.json(users)
})

app.post('/user/', async (c) => {
  const data = await c.req.json()
  const user = await client().user.create({
    data: data
  })
  return c.json(user)
})

app.get('/user/:id/', async (c) => {
  const id = c.req.param('id')
  const user = await client().user.findUnique({
    where: {
      id: Number(id)
    }
  })
  return c.json(user)
})

app.put('/user/:id/', async (c) => {
  const data = await c.req.json()
  const user = await client().user.update({
    where: {
      id: Number(c.req.param('id'))
    },
    data: data
  })
  return c.json(user)
})

app.delete('/user/:id/', async (c) => {
  const id = c.req.param('id')
  const user = await client().user.delete({
    where: {
      id: Number(id)
    }
  })
  return c.json(user)
})

app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app
