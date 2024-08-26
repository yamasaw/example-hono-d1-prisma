import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

/**
 * 指定されたD1データベースの接続設定を永続管理し
 * clientを返す関数
 * 初回の呼び出しときにはD1の接続設定よりclientを生成して返し
 * 二回目以降の呼び出しでは生成済みのclientを返す
 */
export const client = function () {
  let  client: PrismaClient
  return function (database?: D1Database) {
    if (!client) {
      if (!database) {
        throw new Error('Adapter is not provided')
      }
      const adapter = new PrismaD1(database)
      client = new PrismaClient({ adapter })
    }
    return client
  }
}()
  