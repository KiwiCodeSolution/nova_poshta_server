import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerDto } from './dto/mailer_send.dto';
import { MembershipRequestDto } from './dto/Membersmembership_request.dto';
import { ConfigService } from '@nestjs/config';

@Controller('email')
export class MailerController {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) { }

  @Post('send')
  async sendEmail(@Body() dto: MailerDto) {
    const { to, subject, text, html } = dto;
    return this.mailerService.sendMail(to, subject, text, html);
  }

  @Post('membership-request')
  async sendMembershipRequest(@Body() dto: MembershipRequestDto) {
    const {  phone, region } = dto;

    const subject ='З сайту отримано нову заявку на вступ';
    const text = `Имя: ${region}\nТелефон: ${phone}`;
    const html = `
      <p>Регіон: ${region}</p>
      <p>Телефон: ${phone}</p>
    `;
    const emailRecipients = this.configService.get<string>('MEMBERSHIP_EMAILS');
    return this.mailerService.sendMail(
      // 'taar12sh@gmail.com',
      // 'E.a.poduzova@gmail.com',
      emailRecipients,
      subject,
      text,
      html,
    );
  }
}
