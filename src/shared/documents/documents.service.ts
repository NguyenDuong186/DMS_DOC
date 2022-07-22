import {HttpException, HttpStatus, Injectable} from '@nestjs/common'
import {Prisma} from '@prisma/client'
import {HISTORY_ACTION} from 'src/database/enum'
import {PrismaService} from 'src/database/prisma/prisma.service'

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAllDocs(query: {where?: Prisma.DocumentWhereInput}, userId, phan_nhom_van_ban) {
    const {where} = query
    const docByAuthor = await this.prisma.document.findMany({
      where: where,
      orderBy: {
        ngay_ban_hanh: 'desc',
      },
      include: {
        don_vi_vao_so: true,
        don_vi_soan_thao: true,
        don_vi_noi_bo: true,
        loai_van_ban: true,
        co_quan_ban_hanh: true,
        noi_nhan: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        usersRecevie: true,
      },
    })
    const docByRecevie = await this.prisma.documentShareUser.findMany({
      where: {
        userId: userId,
      },
      select: {
        document: {
          include: {
            don_vi_vao_so: true,
            don_vi_soan_thao: true,
            don_vi_noi_bo: true,
            loai_van_ban: true,
            co_quan_ban_hanh: true,
            noi_nhan: true,
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
            usersRecevie: true,
          },
        },
      },
    })
    const doc = docByRecevie.map((item) => item.document).filter((item) => item.phan_nhom_van_ban === phan_nhom_van_ban)
    const result = docByAuthor.concat(doc)
    return Array.from(new Set(result))
  }

  async findDocById(id: number, userId: number) {
    const docShare = await this.prisma.documentShareUser.findMany({where: {userId}}) // userID: 2
    const handleDoc = await this.prisma.taskDocument.findMany({where: {nguoi_xu_ly_id: userId}})
    const user = await this.prisma.user.findUnique({where: {id: userId}})
    const check = docShare.some((item) => item.documentId === id)
    const checkHandleDoc = handleDoc.some((item) => item.van_ban_id === id)
    if (!check && user.role != 'Admin' && user.role != 'VanThu' && !checkHandleDoc)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    const docByID = await this.prisma.document.findUnique({
      where: {id},
      include: {
        don_vi_vao_so: true,
        don_vi_soan_thao: true,
        don_vi_noi_bo: true,
        loai_van_ban: true,
        co_quan_ban_hanh: true,
        noi_nhan: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        usersRecevie: true,
      },
    })

    return docByID
  }

  async findDocByFilter(data, userId) {
    const {
      phan_nhom_van_ban,
      tu_khoa,
      don_vi_vao_so_id,
      co_quan_ban_hanh_id,
      date_from,
      date_to,
      tagId,
      don_vi_soan_thao_id,
      nguoi_ky,
    } = data
    const docDeShare = await this.prisma.documentShareUser.findMany({
      where: {userId: userId},
      select: {
        documentId: true,
      },
    })
    const docId = docDeShare.map((item) => item.documentId)

    const docByfilter = await this.prisma.document.findMany({
      orderBy: {
        ngay_ban_hanh: 'desc',
      },
      where: {
        AND: [
          {
            id: {in: docId},
          },
          {
            OR: [
              {
                so_ky_hieu: {
                  contains: tu_khoa,
                },
              },
              {
                so_hieu: {
                  contains: tu_khoa,
                },
              },
              {
                so_hieu_phu: {
                  contains: tu_khoa,
                },
              },
              {
                trich_yeu: {
                  contains: tu_khoa,
                },
              },
            ],
          },
          {
            phan_nhom_van_ban: phan_nhom_van_ban,
          },
          {
            don_vi_vao_so_id: don_vi_vao_so_id,
          },
          {
            don_vi_soan_thao_id: don_vi_soan_thao_id,
          },
          {
            co_quan_ban_hanh_id: co_quan_ban_hanh_id,
          },
          {
            ngay_ban_hanh: {
              lte: date_to,
            },
          },
          {
            ngay_ban_hanh: {
              gte: date_from,
            },
          },
          {
            tagId: tagId,
          },
          {
            nguoi_ky: nguoi_ky,
          },
        ],
      },
      include: {
        don_vi_vao_so: true,
        don_vi_soan_thao: true,
        don_vi_noi_bo: true,
        loai_van_ban: true,
        co_quan_ban_hanh: true,
        noi_nhan: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        usersRecevie: true,
      },
    })
    return docByfilter
  }

  async createDoc(data, authorId: any) {
    const {phan_nhom_van_ban} = data
    try {
      if (phan_nhom_van_ban === 'DE') {
        const docDe = await this.prisma.document.create({
          data: {
            is_deleted: false,
            authorId: authorId,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            co_quan_ban_hanh_id: data.co_quan_ban_hanh_id,
            tagId: data.tagId,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            so_trang: data.so_trang,
            do_khan: data.do_khan,
            do_mat: data.do_mat,
            ngay_den: data.ngay_den,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            user_xu_ly_id: authorId,
          },
        })

        await this.prisma.historyEditDocument.create({
          data: {
            documentId: docDe.id,
            editorId: docDe.authorId,
            update_detail: HISTORY_ACTION.BAN_HANH_VAN_BAN,
          },
        })

        return docDe
      } else if (phan_nhom_van_ban === 'DH') {
        const docDh = await this.prisma.document.create({
          data: {
            is_deleted: false,
            authorId: authorId,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            tagId: data.tagId,
            so_hieu: data.so_hieu,
            so_hieu_phu: data.so_hieu_phu,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            ngay_hieu_luc: data.ngay_hieu_luc,
            ngay_het_hieu_luc: data.ngay_het_hieu_luc,
            tinh_trang_hieu_luc: data.tinh_trang_hieu_luc,
            do_mat: data.do_mat,
            nguoi_ky: data.nguoi_ky,
            ngay_ky: data.ngay_ky,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            user_xu_ly_id: authorId,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: docDh.id,
            editorId: docDh.authorId,
            update_detail: HISTORY_ACTION.BAN_HANH_VAN_BAN,
          },
        })
        return docDh
      } else if (phan_nhom_van_ban === 'DI') {
        const docDi = await this.prisma.document.create({
          data: {
            is_deleted: false,
            authorId: authorId,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            tagId: data.tagId,
            so_hieu: data.so_hieu,
            so_hieu_phu: data.so_hieu_phu,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            noi_nhan_id: data.noi_nhan_id,
            so_trang: data.so_trang,
            do_khan: data.do_khan,
            do_mat: data.do_mat,
            nguoi_ky: data.nguoi_ky,
            ngay_ky: data.ngay_ky,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            user_xu_ly_id: authorId,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: docDi.id,
            editorId: docDi.authorId,
            update_detail: HISTORY_ACTION.BAN_HANH_VAN_BAN,
          },
        })
        return docDi
      } else if (phan_nhom_van_ban === 'DC') {
        const docDC = await this.prisma.document.create({
          data: {
            is_deleted: false,
            authorId: authorId,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            don_vi_noi_bo_id: data.don_vi_noi_bo_id,
            tagId: data.tagId,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            do_mat: data.do_mat,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            user_xu_ly_id: authorId,
          },
        })
        await this.prisma.documentShareUser.create({
          data: {
            userId: data.van_thu_dvnb_id,
            documentId: docDC.id,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: docDC.id,
            editorId: docDC.authorId,
            update_detail: HISTORY_ACTION.BAN_HANH_VAN_BAN,
          },
        })
        return docDC
      }
    } catch (error) {
      throw new HttpException('create Doc failed', HttpStatus.BAD_REQUEST)
    }
  }

  async updateDoc(id: number, data) {
    const {phan_nhom_van_ban} = data
    try {
      if (phan_nhom_van_ban === 'DE') {
        const docDe = await this.prisma.document.update({
          where: {id},
          data: {
            id: id,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            co_quan_ban_hanh_id: data.co_quan_ban_hanh_id,
            tagId: data.tagId,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            so_trang: data.so_trang,
            do_khan: data.do_khan,
            do_mat: data.do_mat,
            ngay_den: data.ngay_den,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: id,
            editorId: docDe.authorId,
            update_detail: HISTORY_ACTION.CHINH_SUA_VAN_BAN,
          },
        })
        return docDe
      } else if (phan_nhom_van_ban === 'DH') {
        const docDh = await this.prisma.document.update({
          where: {id},
          data: {
            id: id,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            tagId: data.tagId,
            so_hieu: data.so_hieu,
            so_hieu_phu: data.so_hieu_phu,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            ngay_hieu_luc: data.ngay_hieu_luc,
            ngay_het_hieu_luc: data.ngay_het_hieu_luc,
            tinh_trang_hieu_luc: data.tinh_trang_hieu_luc,
            do_mat: data.do_mat,
            nguoi_ky: data.nguoi_ky,
            ngay_ky: data.ngay_ky,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            url_doc: 'http://localhost:5001/api/v1/documents/download/file/' + data.file_name,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: id,
            editorId: docDh.authorId,
            update_detail: HISTORY_ACTION.CHINH_SUA_VAN_BAN,
          },
        })
        return docDh
      } else if (phan_nhom_van_ban === 'DI') {
        const docDi = await this.prisma.document.update({
          where: {id},
          data: {
            id: id,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            tagId: data.tagId,
            so_hieu: data.so_hieu,
            so_hieu_phu: data.so_hieu_phu,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            noi_nhan_id: data.noi_nhan_id,
            so_trang: data.so_trang,
            do_khan: data.do_khan,
            do_mat: data.do_mat,
            nguoi_ky: data.nguoi_ky,
            ngay_ky: data.ngay_ky,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            url_doc: 'http://localhost:5001/api/v1/documents/download/file/' + data.file_name,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: id,
            editorId: docDi.authorId,
            update_detail: HISTORY_ACTION.CHINH_SUA_VAN_BAN,
          },
        })
        return docDi
      } else if (phan_nhom_van_ban === 'DC') {
        const docDC = await this.prisma.document.update({
          where: {id},
          data: {
            id: id,
            phan_nhom_van_ban: data.phan_nhom_van_ban,
            don_vi_vao_so_id: data.don_vi_vao_so_id,
            ngay_ban_hanh: data.ngay_ban_hanh,
            don_vi_soan_thao_id: data.don_vi_soan_thao_id,
            don_vi_noi_bo_id: data.don_vi_noi_bo_id,
            tagId: data.tagId,
            so_ky_hieu: data.so_ky_hieu,
            trich_yeu: data.trich_yeu,
            do_mat: data.do_mat,
            ghi_chu: data.ghi_chu,
            file_name: data.file_name,
            url_doc: 'http://localhost:5001/api/v1/documents/download/file/' + data.file_name,
          },
        })
        await this.prisma.historyEditDocument.create({
          data: {
            documentId: id,
            editorId: docDC.authorId,
            update_detail: HISTORY_ACTION.CHINH_SUA_VAN_BAN,
          },
        })

        return docDC
      }
    } catch (error) {
      throw new HttpException('update Doc failed', HttpStatus.BAD_REQUEST)
    }
  }

  async deleteDoc(data: any[]) {
    try {
      data.forEach(async (item) => {
        await this.prisma.document.update({
          where: {id: item},
          data: {
            is_deleted: true,
          },
        })
      })
      return new HttpException('Delete Doc successfull', HttpStatus.OK)
    } catch (error) {
      throw new HttpException('Deleted doc failed', HttpStatus.BAD_REQUEST)
    }
  }
}
