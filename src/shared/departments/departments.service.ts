import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
// import {Department} from '@prisma/client'
// import {ok} from 'assert'
import {Prisma} from '@prisma/client'
import {PrismaService} from 'src/database/prisma/prisma.service'

@Injectable()
export class DepartmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllDepartment() {
    const selectEmpoloyee = {
      id: true,
      name: true,
      email: true,
      job_title: true,
      departmentId: true,
    }
    const list = await this.prisma.department.findMany({
      orderBy: {id: 'asc'},
      include: {
        employee: {
          select: selectEmpoloyee,
        },
      },
    })
    const department = await Promise.all(
      list.map(async (item) => {
        if (!item.van_thu_id) return {...item, van_thu: null}
        const vanThu = await this.prisma.user.findUnique({where: {id: item.van_thu_id}, select: selectEmpoloyee})
        return {...item, van_thu: vanThu}
      })
    )
    return department
  }

  async findDepartmentById(id: number) {
    const department = await this.prisma.department.findUnique({
      where: {id},
      include: {
        employee: {
          select: {
            id: true,
            name: true,
            job_title: true,
          },
        },
      },
    })
    if (!department) throw new HttpException('NOT_FOUND', HttpStatus.NOT_FOUND)
    return department
  }

  async addDepartment(data: Prisma.DepartmentCreateInput) {
    const departmentNew = await this.prisma.department.create({
      data: {
        title: data.title,
        department_code: data.department_code,
      },
    })
    return departmentNew
  }

  async addUserToDepartment(id: number, data: any[]) {
    data.forEach(async (item) => {
      await this.prisma.user.update({
        where: {id: item},
        data: {
          departmentId: id,
        },
      })
    })
    return new HttpException('add successful', HttpStatus.OK)
  }

  async deleteUserInDepartment(id: number) {
    await this.prisma.user.update({
      where: {id},
      data: {
        departmentId: null,
      },
    })
    return new HttpException('delete successful', HttpStatus.OK)
  }

  async updateDepartment(id: number, data: any) {
    const {van_thu_id, title} = data
    const department = await this.prisma.department.findUnique({
      where: {id},
    })
    if (department.van_thu_id) {
      await this.prisma.department.update({
        where: {id},
        data: {
          title,
          van_thu_id: van_thu_id,
        },
      })

      await this.prisma.user.update({
        where: {id: department.van_thu_id},
        data: {
          is_van_thu: false,
          role: 'User',
        },
      })

      await this.prisma.user.update({
        where: {id: van_thu_id},
        data: {
          is_van_thu: true,
          role: 'VanThu',
        },
      })
    }
    await this.prisma.department.update({
      where: {id},
      data: {
        title,
        van_thu_id: van_thu_id,
        department_code: data.department_code,
      },
    })
    if (van_thu_id) {
      await this.prisma.user.update({
        where: {id: van_thu_id},
        data: {
          is_van_thu: true,
          role: 'VanThu',
        },
      })
    }

    return new HttpException('Update successful', HttpStatus.OK)
  }

  async deleteDepartment(id: number) {
    return await this.prisma.department.delete({
      where: {id},
    })
  }
}
