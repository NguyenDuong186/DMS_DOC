import {Module} from '@nestjs/common'
import {ArgencysService} from './argencys.service'
import {ArgencysController} from './argencys.controller'

@Module({
  providers: [ArgencysService],
  controllers: [ArgencysController],
})
export class ArgencysModule {}
