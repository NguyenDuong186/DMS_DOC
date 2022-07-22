import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards} from '@nestjs/common'
import {Request} from 'express'
import {Roles} from 'src/common/decorators'
import {AtGuard, RolesGuard} from 'src/common/guards'
import {Role} from 'src/database/enum'
import {UsersService} from './users.service'

@Controller('/api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('')
  @Roles(Role.Admin, Role.VanThu)
  @UseGuards(AtGuard, RolesGuard)
  async findAllUsers(@Query() query: any, @Req() req: Request) {
    const {filter_email, filter_job} = query

    return await this.usersService.findAllUsers({
      where: {
        AND: [
          {
            email: {
              contains: filter_email,
            },
          },
          {
            job_title: {
              contains: filter_job,
            },
          },
        ],
      },
    })
  }

  @Get('notdepartmentid')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async findUserNotDepartmentId() {
    return await this.usersService.findUserNotDepartmentId()
  }

  @Get('/:id')
  @UseGuards(AtGuard)
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.findUserById(id)
  }

  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  @Post('')
  async addUser(@Body() body) {
    return await this.usersService.addUser(body)
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() body) {
    return await this.usersService.updateUser(id, body)
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id)
  }
}
