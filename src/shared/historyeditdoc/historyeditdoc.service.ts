import {Injectable} from '@nestjs/common'
import {PrismaService} from 'src/database/prisma/prisma.service'

@Injectable()
export class HistoryeditDocService {
  constructor(private prisma: PrismaService) {}

  async findAll(id: number) {
    return await this.prisma.historyEditDocument.findMany({
      where: {
        documentId: id,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        editor: {
          select: {
            id: true,
            email: true,
            name: true,
            job_title: true,
            departmentId: true,
          },
        },
        document: true,
      },
    })
  }
}
