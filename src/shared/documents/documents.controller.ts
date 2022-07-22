import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  StreamableFile,
  Response,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common'
import {Request} from 'express'
import {DocumentsService} from './documents.service'
import {FileInterceptor} from '@nestjs/platform-express'
import {diskStorage} from 'multer'
import {Observable, of} from 'rxjs'
import {join} from 'path'
import {createReadStream} from 'fs'
import {DocDEDto} from './dtos'
import {AtGuard} from 'src/common/guards'
import {Roles} from 'src/common/decorators'
import {Role} from 'src/database/enum'
import {convert} from 'src/common/helper/convertNameFile'

function removeVietnameseTones(str) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
  str = str.replace(/đ/g, 'd')
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
  str = str.replace(/Đ/g, 'D')
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, '') // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, ' ')
  str = str.trim()
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ')
  return str
}
export const storage = {
  storage: diskStorage({
    destination: './upload/files',
    filename: (req, file, cb) => {
      // const filename: string = path.extname(file.originalname).name.replace(/\s/g, '') + uuidv4()
      // const extension: string = path.extname(file.originalname).ext

      const customFileName = convert(file.originalname)
      // const fileExtension = file.originalname.split('.')[1] // get file extension from original file name
      cb(null, customFileName)
      // cb(null, file.originalname)
    },
  }),
}
@Controller('/api/v1/documents')
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Get('')
  @UseGuards(AtGuard)
  async findAllDocs(@Query() query, @Req() req: Request) {
    const {phan_nhom_van_ban} = query
    return await this.documentsService.findAllDocs(
      {
        where: {
          AND: [
            {
              phan_nhom_van_ban: {
                contains: phan_nhom_van_ban,
              },
            },
            {
              authorId: req.user?.['sub'],
            },
            {
              is_deleted: false,
            },
          ],
        },
      },
      req.user?.['sub'],
      phan_nhom_van_ban
    )
  }
  @Get('/:id')
  @UseGuards(AtGuard)
  async findDocById(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user?.['sub']
    return await this.documentsService.findDocById(id, userId)
  }

  @Post('/filterdoc')
  @UseGuards(AtGuard)
  async findDocByFilter(@Body() body, @Req() req: Request) {
    const userId = req.user?.['sub']
    return await this.documentsService.findDocByFilter(body, userId)
  }

  @Post('')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard)
  async createDoc(@Body() data, @Req() req: Request) {
    const userId = req.user?.['sub']
    return await this.documentsService.createDoc(data, userId)
  }

  @Patch('/:id')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard)
  async updateDoc(@Param('id', ParseIntPipe) id: number, @Body() body: DocDEDto) {
    return await this.documentsService.updateDoc(id, body)
  }
  // @Patch('vbdh/:id')
  // async updateDocDH(@Param('id', ParseIntPipe) id: number, @Body() body: DocDEDto) {
  //   return await this.documentsService.updateDocDH(id, body)
  // }

  @Post('/deletedoc')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard)
  async deleteDoc(@Body() body: any) {
    const {docs} = body
    return await this.documentsService.deleteDoc(docs)
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(@UploadedFile() file) {
    // return await this.documentsService.uploadFile(file, id)
    return of({filePath: file.filename})
  }

  @Get('/download/file/:urlfiles')
  getUrlFile(@Param('urlfiles') urlfiles, @Res() res): Observable<object> {
    return of(res.sendFile(join(process.cwd(), 'upload/files/' + urlfiles)))
  }

  @Get('/streamer/file/:filename')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard)
  getFile(@Response({passthrough: true}) res, @Param('filename') filename): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'upload/files/' + filename))
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename=${filename}`,
    })
    return new StreamableFile(file)
  }
}
