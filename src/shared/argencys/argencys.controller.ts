import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common'
import {Roles} from 'src/common/decorators'
import {AtGuard, RolesGuard} from 'src/common/guards'
import {Role} from 'src/database/enum'
import {ArgencysService} from './argencys.service'
import {ArgencyCreateDto, ArgencyUpdateDto} from './dtos'

@Controller('/api/v1/argencys')
export class ArgencysController {
  constructor(private argencysService: ArgencysService) {}

  @Get('')
  @UseGuards(AtGuard, RolesGuard)
  async findAllArgencys() {
    return await this.argencysService.findAllArgencys()
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.argencysService.findArgencyById(id)
  }

  @Post('')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async addUser(@Body() data: ArgencyCreateDto) {
    return await this.argencysService.addArgency(data)
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: ArgencyUpdateDto) {
    return await this.argencysService.updateArgency(id, dto)
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.argencysService.deleteArgency(id)
  }
}
