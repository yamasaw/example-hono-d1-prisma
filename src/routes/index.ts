import { Hono } from 'hono'

const app = new Hono()

app.get('/', async (c) => {
  return c.json({ message: 'Hello World' })
})

app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app