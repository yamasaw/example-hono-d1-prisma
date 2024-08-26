import { Hono } from "hono"
import { client } from "@/utils/prisma"

const app = new Hono()
.get('/', async (c) => {
  const users = await client().user.findMany()
  return c.json(users)
})
.post('/', async (c) => {
  const data = await c.req.json()
  const user = await client().user.create({
    data: data
  })
  return c.json(user)
})
.get('/:id/', async (c) => {
  const id = c.req.param('id')
  const user = await client().user.findUnique({
    where: {
      id: Number(id)
    }
  })
  return c.json(user)
})
.put('/:id/', async (c) => {
  const data = await c.req.json()
  const user = await client().user.update({
    where: {
    id: Number(c.req.param('id'))
    },
    data: data
  })
  return c.json(user)
})
.delete('/:id/', async (c) => {
  const id = c.req.param('id')
  const user = await client().user.delete({
    where: {
      id: Number(id)
    }
  })
  return c.json(user)
})

export default app