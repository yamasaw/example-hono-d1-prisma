import { Hono } from 'hono'
import { client } from "@/utils/prisma"
import index from "@/routes/index"
import user from "@/routes/user"

type Bindings = {
  DB: D1Database
}
const app = new Hono<{Bindings: Bindings}>()

// ミドルウェアでDBをバインド
app.use('*', async (c, next) => {
  client(c.env.DB)
  await next()
})

app.route('/', index)
app.route('user/', user)


export default app
