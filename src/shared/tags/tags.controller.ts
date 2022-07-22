import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards} from '@nestjs/common'
import {Tag} from '@prisma/client'
import {Roles} from 'src/common/decorators'
import {AtGuard, RolesGuard} from 'src/common/guards'
import {Role} from 'src/database/enum'
import {TagCreateDto} from './dtos'
import {TagsService} from './tags.service'

@Controller('/api/v1/tags')
export class TagsController {
  constructor(private tagsService: TagsService) {}

  @Get('')
  @UseGuards(AtGuard, RolesGuard)
  async findAllUsers() {
    return await this.tagsService.findAllTags()
  }

  @Get('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async findUserById(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.findTagById(id)
  }

  @Post('')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async addUser(@Body() data: TagCreateDto) {
    return await this.tagsService.addTag(data)
  }

  @Patch('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async updateUser(@Param('id', ParseIntPipe) id: number, @Body() data: Tag) {
    return await this.tagsService.updateTag(id, data)
  }

  @Delete('/:id')
  @Roles(Role.Admin)
  @UseGuards(AtGuard, RolesGuard)
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.tagsService.deleteTag(id)
  }
}
