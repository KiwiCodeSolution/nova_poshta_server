import { Injectable } from '@nestjs/common';
import { MailerService as NestMailerService } from '@nestjs-modules/mailer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class MailerService {
  constructor(
    private readonly mailerService: NestMailerService,
    private readonly userService: UsersService,
  ) {}

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        text,
        html,
      });
      console.log(`Email sent to ${to}`);
    } catch (error) {
      console.error(`Failed to send email to ${to}`, error);
      throw new Error(`Failed to send email to ${to}`);
    }
  }
  //  для автоматической рассылки всем пользователям
  async sendNewsletter(
    subject: string,
    text: string,
    html: string,
  ): Promise<void> {
    const users = await this.userService.findAll();
    for (const user of users) {
      await this.sendMail(user.email, subject, text, html);
    }
  }
}
