import {ForbiddenException, HttpException, HttpStatus, Injectable} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {UserDto, UserUpdateDto} from './dtos'
import {Prisma} from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAllUsers(query: {where?: Prisma.UserWhereInput}) {
    const {where} = query
    return await this.prisma.user.findMany({
      orderBy: {id: 'asc'},
      where: where,
      select: {
        id: true,
        name: true,
        email: true,
        job_title: true,
        department: true,
        departmentId: true,
      },
    })
  }

  async findUserNotDepartmentId() {
    return await this.prisma.user.findMany({
      where: {
        departmentId: null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        job_title: true,
        role: true,
      },
    })
  }

  async findUserById(id: number) {
    return await this.prisma.user.findUnique({
      where: {id},
      select: {
        id: true,
        name: true,
        email: true,
        job_title: true,
      },
    })
  }

  async addUser(data) {
    const {id, name, email, password, job_title, departmentId} = data
    if (email) {
      const user = await this.prisma.user.findUnique({where: {email: email}})
      if (user) throw new ForbiddenException('email existed')
    }
    const hashPassword = await this.hashPassword(password)
    const userNew = await this.prisma.user.create({
      data: {
        id,
        name,
        email,
        password: hashPassword,
        job_title,
        departmentId,
      },

      select: {
        id: true,
        name: true,
        email: true,
        job_title: true,
        departmentId: true,
        department: true,
      },
    })
    return userNew
  }

  async updateUser(id: number, data: any) {
    const {email} = data
    const user = await this.prisma.user.findUnique({where: {id: id}})
    if (email === user.email) {
      await this.prisma.user.update({
        where: {id: id},
        data: {
          name: data.name,
          job_title: data.job_title,
          departmentId: data.departmentId,
        },
      })
      return new HttpException('update successfull', HttpStatus.OK)
    }
    if (await this.prisma.user.findUnique({where: {email: email}}))
      return new HttpException('Email existed', HttpStatus.BAD_REQUEST)
    await this.prisma.user.update({
      where: {id: id},
      data: {
        name: data.name,
        email: data.email,
        job_title: data.job_title,
        departmentId: data.departmentId,
      },
    })
    return new HttpException('update successfull', HttpStatus.OK)
  }

  async deleteUser(index: number) {
    return await this.prisma.user.delete({where: {id: index}})
  }

  hashPassword(data: string) {
    return bcrypt.hash(data, 10)
  }
}
