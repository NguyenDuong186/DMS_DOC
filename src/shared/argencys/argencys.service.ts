import {ForbiddenException, Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {ArgencyCreateDto, ArgencyUpdateDto} from './dtos'

@Injectable()
export class ArgencysService {
  constructor(private prisma: PrismaService) {}
  async findAllArgencys() {
    return await this.prisma.argency.findMany({
      orderBy: {
        id: 'asc',
      },
    })
  }

  async findArgencyById(id: number) {
    return await this.prisma.argency.findUnique({
      where: {id},
    })
  }

  async addArgency(data) {
    const {title} = data
    if (title) {
      const argency = await this.prisma.argency.findUnique({where: {title: title}})
      if (argency) throw new ForbiddenException('title existed')
    }
    const argencyNew = await this.prisma.argency.create({
      data: data,
    })
    return argencyNew
  }

  async updateArgency(id: number, data: ArgencyUpdateDto) {
    const {title} = data
    if (title) {
      const argency = await this.prisma.argency.findUnique({where: {title: title}})
      if (argency) throw new ForbiddenException('title existed')
    }
    return await this.prisma.argency.update({where: {id}, data: data})
  }

  async deleteArgency(id: any) {
    return await this.prisma.argency.delete({where: {id}})
  }
}
