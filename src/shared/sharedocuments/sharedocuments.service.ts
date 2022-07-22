import {HISTORY_ACTION} from './../../database/enum/role.enum'
import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'
import {MailService} from '../mail/mail.service'

@Injectable()
export class SharedocumentsService {
  constructor(private prisma: PrismaService, private mail: MailService) {}

  async getListUsers(id: number) {
    try {
      const listUsershare = await this.prisma.documentShareUser.findMany({
        where: {
          documentId: id,
        },
        include: {
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          document: true,
        },
      })
      return listUsershare
    } catch (error) {
      throw new HttpException('get listUser failed', HttpStatus.BAD_REQUEST)
    }
  }

  async getUserNotShared(id: number, author: any) {
    try {
      const listUsershare = await this.prisma.documentShareUser.findMany({
        where: {
          documentId: id,
        },
        include: {
          document: {
            select: {
              authorId: true,
            },
          },
        },
      })
      const listUserId = listUsershare.map((item) => item.userId)
      const listAllId = listUserId.push(author)
      const listAuthorId = listUsershare.map((item) => item.document.authorId)
      const listId = listAuthorId.concat(listUserId)
      const listUserNotShared = await this.prisma.user.findMany({
        where: {
          id: {notIn: listId},
        },
      })
      return listUserNotShared
    } catch (error) {
      throw new HttpException('update Doc failed', HttpStatus.BAD_REQUEST)
    }
  }

  async addUserToList(id: number, data: any[]) {
    // try {
    data.forEach(async (item) => {
      await this.prisma.documentShareUser.create({
        data: {
          userId: item,
          documentId: id,
        },
        include: {
          document: true,
        },
      })
    })
    const author = await this.prisma.document.findUnique({
      where: {id: id},
    })
    await this.prisma.historyEditDocument.create({
      data: {
        documentId: id,
        editorId: author.authorId,
        update_detail: HISTORY_ACTION.CHIA_SE_VAN_BAN,
      },
    })
    const userMockup = {name: 'Anh Duy', email: 'anhduycnttx1@gmail.com'}
    await this.mail.sendUserConfirmation(userMockup)
    return new HttpException('add successful', HttpStatus.OK)
    // } catch (error) {
    //   throw new HttpException('add failed', HttpStatus.BAD_REQUEST)
    // }
  }

  async deleteUserFromList(id: number, data: any[]) {
    try {
      data.forEach(async (item) => {
        await this.prisma.documentShareUser.deleteMany({
          where: {
            AND: [
              {
                userId: item,
              },
              {
                documentId: id,
              },
            ],
          },
        })
      })
      const author = await this.prisma.document.findUnique({
        where: {id: id},
      })
      await this.prisma.historyEditDocument.create({
        data: {
          documentId: id,
          editorId: author.authorId,
          update_detail: HISTORY_ACTION.THU_HOI_VAN_BAN,
        },
      })
      return new HttpException('delete successful', HttpStatus.OK)
    } catch (error) {
      throw new HttpException('delete failed', HttpStatus.BAD_REQUEST)
    }
  }
}
