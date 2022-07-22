import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards} from '@nestjs/common'
import {AtGuard} from 'src/common/guards'
import {TaskDocCreateDto} from './dtos'
import {TaskDocumentsService} from './task-documents.service'
import {Request} from 'express'

@Controller('/api/v1/taskdocuments')
export class TaskDocumentsController {
  constructor(private taskdocumentsService: TaskDocumentsService) {}

  @Get('/test')
  async getAllTaskDosssc(@Req() req: Request) {
    const arr = new Array(100000).fill(0).map((v, i) => ({
      username: `user ${i + 1}`,
      id: i + 1,
    }))
    return arr
  }

  @Get()
  @UseGuards(AtGuard)
  async getAllTaskDoc(@Req() req: Request) {
    return await this.taskdocumentsService.getAllTaskDoc(req.user?.['sub'])
  }

  @Get('/:id')
  @UseGuards(AtGuard)
  async getTaskDocById(@Param('id', ParseIntPipe) id: number) {
    return await this.taskdocumentsService.getTaskDocById(id)
  }

  @Post('')
  @UseGuards(AtGuard)
  async createTaskDoc(@Body() data: any, @Req() req: Request) {
    return await this.taskdocumentsService.createTaskDoc(data, req.user?.['sub'])
  }

  @Patch('/:id')
  @UseGuards(AtGuard)
  async updateTaskDoc(@Param('id', ParseIntPipe) id: number, @Body() body) {
    return await this.taskdocumentsService.updateTaskDoc(id, body)
  }
}
