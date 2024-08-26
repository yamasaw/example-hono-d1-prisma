import { Hono } from 'hono'

const app = new Hono()
.get('/', async (c) => {
  return c.json({ message: 'Hello World' })
})
.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app