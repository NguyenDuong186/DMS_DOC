import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {Prisma} from '@prisma/client'
import {TaskDocCreateDto} from './dtos'
import {HISTORY_ACTION, Status} from 'src/database/enum'

@Injectable()
export class TaskDocumentsService {
  constructor(private prisma: PrismaService) {}

  async getAllTaskDoc(userId) {
    return await this.prisma.taskDocument.findMany({
      where: {
        AND: [
          {
            nguoi_xu_ly_id: userId,
          },
          {
            is_completed: false,
          },
        ],
      },
      include: {
        van_ban: true,
        nguoi_giao: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
          },
        },
        nguoi_xu_ly: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
          },
        },
        nguoi_lien_quan: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
            departmentId: true,
            is_van_thu: true,
          },
        },
      },
    })
  }

  async getTaskDocById(id: number) {
    return await this.prisma.taskDocument.findMany({
      where: {
        van_ban_id: id,
      },
      include: {
        van_ban: true,
        nguoi_giao: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
          },
        },
        nguoi_xu_ly: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
          },
        },
        nguoi_lien_quan: {
          select: {
            id: true,
            name: true,
            job_title: true,
            role: true,
            departmentId: true,
            is_van_thu: true,
          },
        },
      },
    })
  }

  async createTaskDoc(data: Prisma.TaskDocumentUncheckedCreateInput, userId: any) {
    const taskDoc = await this.prisma.taskDocument.findMany({
      where: {
        AND: [
          {
            van_ban_id: data.van_ban_id,
          },
          {
            is_processing: true,
          },
        ],
      },
    })
    try {
      if (taskDoc) {
        await this.prisma.taskDocument.updateMany({
          where: {
            AND: [
              {
                van_ban_id: data.van_ban_id,
              },
              {
                is_processing: true,
              },
            ],
          },
          data: {
            is_processing: false,
          },
        })
      }
      const createTask = await this.prisma.taskDocument.create({
        data: {
          van_ban_id: data.van_ban_id,
          nguoi_giao_id: userId,
          nguoi_xu_ly_id: data.nguoi_xu_ly_id,
          nguoi_lien_quan_id: data.nguoi_lien_quan_id,
          han_xu_ly: data.han_xu_ly,
          noi_dung: data.noi_dung,
          status: Status.Process,
          is_processing: true,
          is_completed: false,
        },
        include: {
          nguoi_xu_ly: {
            select: {
              id: true,
              name: true,
              job_title: true,
              role: true,
              departmentId: true,
              is_van_thu: true,
            },
          },
          nguoi_giao: {
            select: {
              id: true,
              name: true,
              job_title: true,
              role: true,
              departmentId: true,
              is_van_thu: true,
            },
          },
          nguoi_lien_quan: {
            select: {
              id: true,
              name: true,
              job_title: true,
              role: true,
              departmentId: true,
              is_van_thu: true,
            },
          },
        },
      })

      await this.prisma.document.update({
        where: {id: data.van_ban_id},
        data: {
          user_xu_ly_id: createTask.nguoi_xu_ly_id,
          user_hoan_thanh_id: createTask.nguoi_xu_ly_id,
        },
      })

      await this.prisma.historyEditDocument.create({
        data: {
          documentId: data.van_ban_id,
          editorId: createTask.nguoi_giao_id,
          update_detail: HISTORY_ACTION.CHUYEN_XU_LY,
        },
      })

      return createTask
    } catch (error) {
      return new HttpException('completeTask failed', HttpStatus.BAD_REQUEST)
    }
  }

  async updateTaskDoc(id: number, data) {
    try {
      const taskDoc = await this.prisma.taskDocument.updateMany({
        where: {
          AND: [
            {
              van_ban_id: id,
            },
            {
              is_processing: true,
            },
          ],
        },
        data: {
          y_kien: data.y_kien,
          status: Status.Completed,
          is_completed: true,
          is_processing: false,
        },
      })
      const getTask = await this.prisma.taskDocument.findMany({
        where: {
          AND: [
            {
              van_ban_id: id,
            },
            {
              is_completed: true,
            },
          ],
        },
      })
      const nguoi_xu_ly = getTask.find((item) => item.nguoi_xu_ly_id)

      await this.prisma.document.update({
        where: {id: id},
        data: {
          user_xu_ly_id: null,
          user_hoan_thanh_id: null,
        },
      })

      await this.prisma.historyEditDocument.create({
        data: {
          documentId: id,
          editorId: nguoi_xu_ly.nguoi_xu_ly_id,
          update_detail: HISTORY_ACTION.HOAN_THANH_XU_LY,
        },
      })
      return taskDoc
    } catch (error) {
      throw new HttpException('update completeTask failed', HttpStatus.BAD_REQUEST)
    }
  }
}
