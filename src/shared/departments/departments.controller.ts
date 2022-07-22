import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards} from '@nestjs/common'
import {Roles} from 'src/common/decorators'
import {AtGuard} from 'src/common/guards'
import {Role} from 'src/database/enum'
import {DepartmentsService} from './departments.service'
import {Prisma} from '@prisma/client'

@Controller('/api/v1/departments')
export class DepartmentsController {
  constructor(private departmentsService: DepartmentsService) {}

  @Get('')
  @UseGuards(AtGuard)
  async listDepartments() {
    return await this.departmentsService.findAllDepartment()
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.departmentsService.findDepartmentById(id)
  }

  @Post('')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async addDepartment(@Body() data: Prisma.DepartmentCreateInput) {
    return await this.departmentsService.addDepartment(data)
  }

  @Patch('/:id/add-employee')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async addUserToDepartment(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    const {users} = body
    return await this.departmentsService.addUserToDepartment(id, users)
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: any) {
    return await this.departmentsService.updateDepartment(id, data)
  }

  @Delete('/delete-employee/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async deleteUserInDepartment(@Param('id', ParseIntPipe) id: number) {
    return await this.departmentsService.deleteUserInDepartment(id)
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.departmentsService.deleteDepartment(id)
  }
}
