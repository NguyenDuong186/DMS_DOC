import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards} from '@nestjs/common'
import {Request} from 'express'
import {Roles} from 'src/common/decorators'
import {AtGuard} from 'src/common/guards'
import {Role} from 'src/database/enum'
import {SharedocumentsService} from './sharedocuments.service'

@Controller('/api/v1/sharedocuments')
export class SharedocumentsController {
  constructor(private sharedocuments: SharedocumentsService) {}

  @Get('/shareUsers/:id')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard)
  async getListUsers(@Param('id', ParseIntPipe) id: number) {
    return await this.sharedocuments.getListUsers(id)
  }

  @Get('/notshareUsers/:id')
  @UseGuards(AtGuard)
  async getUserNotShared(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return await this.sharedocuments.getUserNotShared(id, req.user?.['sub'])
  }

  @Post('/shareUsers/:id')
  @UseGuards(AtGuard)
  async addUserToList(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const {users} = body
    return await this.sharedocuments.addUserToList(id, users)
  }

  @Patch('/shareUsers/:id')
  @UseGuards(AtGuard)
  async deleteUserFromList(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const {users} = body
    return await this.sharedocuments.deleteUserFromList(id, users)
  }
}
