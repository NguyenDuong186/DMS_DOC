import {HistoryeditDocService} from './historyeditdoc.service'
import {Controller, Get, Param, ParseIntPipe, UseGuards} from '@nestjs/common'
import {AtGuard} from 'src/common/guards'

@Controller('/api/v1/historyeditdoc')
export class HistoryeditDocController {
  constructor(private historyeditDocService: HistoryeditDocService) {}

  @Get('/:id')
  @UseGuards(AtGuard)
  async findHistoryEditDoc(@Param('id', ParseIntPipe) id: number) {
    return await this.historyeditDocService.findAll(id)
  }
}
