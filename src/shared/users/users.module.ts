import {Module} from '@nestjs/common'
import {UsersService} from './users.service'
import {UsersController} from './users.controller'
// import {RolesGuard} from 'src/common/guards'

@Module({
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
