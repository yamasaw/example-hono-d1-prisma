import { Hono } from 'hono'
import { client } from "@/utils/prisma"
import home from "@/home/route"
import user from "@/user/route"

type Bindings = {
  DB: D1Database
}
const app = new Hono<{Bindings: Bindings}>()

// ミドルウェアでDBをバインド
app.use('*', async (c, next) => {
  client(c.env.DB)
  await next()
})

app.route('/', home)
app.route('user/', user)
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

export default app
