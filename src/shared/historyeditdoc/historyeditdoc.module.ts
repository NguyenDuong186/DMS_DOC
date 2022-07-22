import {Module} from '@nestjs/common'
import {HistoryeditDocController} from './historyeditdoc.controller'
import {HistoryeditDocService} from './historyeditdoc.service'

@Module({
  controllers: [HistoryeditDocController],
  providers: [HistoryeditDocService],
})
export class HistoryeditDocModule {}
