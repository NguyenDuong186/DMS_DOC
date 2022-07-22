import {Injectable, OnModuleDestroy, OnModuleInit} from '@nestjs/common'
import {PrismaClient} from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: 'postgresql://duongnt:123456@localhost:5432/docdb?schema=public',
        },
      },
    })
  }
  async onModuleDestroy() {
    await this.$connect()
  }
  async onModuleInit() {
    await this.$disconnect()
  }
}
