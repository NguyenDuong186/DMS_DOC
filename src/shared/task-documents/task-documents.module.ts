import {Module} from '@nestjs/common'
import {TaskDocumentsService} from './task-documents.service'
import {TaskDocumentsController} from './task-documents.controller'

@Module({
  providers: [TaskDocumentsService],
  controllers: [TaskDocumentsController],
})
export class TaskDocumentsModule {}
