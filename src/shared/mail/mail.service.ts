import {MailerService} from '@nestjs-modules/mailer'
import {Injectable} from '@nestjs/common'

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: any) {
    const content = 'check email đã gửi 1 contents'
    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Xác thực từ Anh Duy',
      template: 'confirmation', // `.hbs` extension is appended automatically
      context: {
        name: user.name,
        content,
      },
    })
  }
}
