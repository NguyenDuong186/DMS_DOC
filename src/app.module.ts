import {Module} from '@nestjs/common'
import {PrismaService} from './database/prisma/prisma.service'
import {PrismaModule} from './database/prisma/prisma.module'
import {AuthController} from './auth/auth.controller'
import {AuthModule} from './auth/auth.module'
import {UsersModule} from './shared/users/users.module'
import {ArgencysModule} from './shared/argencys/argencys.module'
import {TagsModule} from './shared/tags/tags.module'
import {DepartmentsModule} from './shared/departments/departments.module'
import {DocumentsModule} from './shared/documents/documents.module'
import {TaskDocumentsModule} from './shared/task-documents/task-documents.module'
import {APP_GUARD} from '@nestjs/core'
import {RolesGuard} from './common/guards'
import {SharedocumentsModule} from './shared/sharedocuments/sharedocuments.module'
import {HistoryeditDocModule} from './shared/historyeditdoc/historyeditdoc.module'
import { MailModule } from './shared/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsersModule,
    ArgencysModule,
    TagsModule,
    DepartmentsModule,
    DocumentsModule,
    TaskDocumentsModule,
    SharedocumentsModule,
    HistoryeditDocModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [PrismaService, {provide: APP_GUARD, useClass: RolesGuard}],
})
export class AppModule {}
