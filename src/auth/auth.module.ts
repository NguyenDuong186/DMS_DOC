import {Module} from '@nestjs/common'
import {JwtModule} from '@nestjs/jwt'
import {RolesGuard} from 'src/common/guards'
import {PrismaModule} from 'src/database/prisma/prisma.module'
import {AuthController} from './auth.controller'

import {AuthService} from './auth.service'
import {JwtAtStrategy, JwtRtStrategy} from './strategy'

@Module({
  imports: [JwtModule.register({}), PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtAtStrategy, JwtRtStrategy, RolesGuard],
  exports: [AuthService],
})
export class AuthModule {}
