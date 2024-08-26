import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { client } from "@/utils/prisma"
import home from "@/app/home/route"
import user from "@/app/user/route"

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
  throw new HTTPException(404, { message: 'Not Found' })
})

export default app
