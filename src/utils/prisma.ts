import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

export const client = function () {
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
  