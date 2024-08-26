import { Hono } from 'hono'
import { client } from "@/utils/prisma"
import index from "@/home/route"
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

app.route('/', index)
app.route('user/', user)


export default app
