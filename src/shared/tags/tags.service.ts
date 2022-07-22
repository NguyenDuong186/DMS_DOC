import {ForbiddenException, Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {Tag} from '@prisma/client'
import {TagCreateDto} from './dtos'

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}
  async findAllTags() {
    return this.prisma.tag.findMany({
      orderBy: {id: 'asc'},
    })
  }

  async findTagById(id: number) {
    return await this.prisma.tag.findUnique({
      where: {id},
    })
  }

  async addTag(data) {
    const {tien_to_sinh_ma} = data
    if (tien_to_sinh_ma) {
      const tag = await this.prisma.tag.findUnique({where: {tien_to_sinh_ma: tien_to_sinh_ma}})
      if (tag) throw new ForbiddenException('Tiền tố sinh mã existed')
    }
    const tagNew = await this.prisma.tag.create({
      data: data,
    })
    return tagNew
  }

  async updateTag(id: number, data: Tag) {
    const {tien_to_sinh_ma} = data
    if (tien_to_sinh_ma) {
      const tag = await this.prisma.tag.findUnique({where: {tien_to_sinh_ma: tien_to_sinh_ma}})
      if (tag) throw new ForbiddenException('Tiền tố sinh mã existed')
    }
    return await this.prisma.tag.update({where: {id}, data: data})
  }

  async deleteTag(id: number) {
    return await this.prisma.tag.delete({where: {id}})
  }
}
