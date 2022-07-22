import {Module} from '@nestjs/common'
import {SharedocumentsService} from './sharedocuments.service'
import {SharedocumentsController} from './sharedocuments.controller'
import {MailModule} from '../mail/mail.module'

@Module({
  imports: [MailModule],
  providers: [SharedocumentsService],
  controllers: [SharedocumentsController],
})
export class SharedocumentsModule {}
