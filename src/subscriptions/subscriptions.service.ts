import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from 'src/utils/logging/logger.service';
import { MailerService } from '../mailer/mailer.service';
import { CreateSubscriptionDto } from './dto/create_subscription.dto';
import { UpdateSubscriptDto } from './dto/update_subscript.dto';
import { Subscription } from './schemas/subscription.schema';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
  ) {}

  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<Subscription> {
    const newSubscription = new this.subscriptionModel(createSubscriptionDto);
    this.logSubscriptionToFile(newSubscription.name, newSubscription.email);
    await this.sendConfirmationEmail(newSubscription.email);
    return newSubscription.save();
  }

  async getSubscribedUsers(): Promise<Subscription[]> {
    return this.subscriptionModel.find({ subscribed: true });
  }

  async updateSubscription(
    updateSubscriptionDto: UpdateSubscriptDto,
  ): Promise<Subscription> {
    const { email, subscribed } = updateSubscriptionDto;

    const subscription = await this.subscriptionModel.findOne({ email });
    if (!subscription) {
      throw new HttpException('Підписку не знайдено', HttpStatus.NOT_FOUND);
    }

    subscription.subscribed = subscribed;
    return subscription.save();
  }

  async confirmSubscription(email: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findOne({ email });
    if (!subscription) {
      throw new HttpException('Підписку не знайдено', HttpStatus.NOT_FOUND);
    }
    subscription.subscribed = !subscription.subscribed;
    return subscription.save();
  }
  private async sendConfirmationEmail(email: string) {
    const confirmationLink = `https://profspilka.org/subscription/confirm?email=${email}`;
    // const confirmationLink = `http://localhost:3000/subscription/confirm?email=${email}`;
    console.log(email);

    await this.mailerService.sendMail(
      email,
      'Підтвердження підписки',
      `Для підтвердження перейдіть за посиланням: ${confirmationLink}`,

      `
  <div style="
    max-width: 520px;
    margin: 0 auto;
    padding: 28px;
    border-radius: 14px;
    background: #f9fafb;
    border: 1px solid #ed1c2342;
    font-family: 'Segoe UI', Arial, sans-serif;
  ">
    <h1 style="
      font-size: 24px;
      margin-bottom: 16px;
      color: #111827;
      text-align: center;
    ">
      Підтвердіть вашу підписку
    </h1>

    <p style="font-size: 16px; line-height: 1.5; color: #374151;">
      Дякуємо, що приєднуєтесь до оновлень з сайту Профспілки групи компаній «NOVA» <b>profspilka.org</b>!  
      Щоб завершити підписку, натисніть кнопку нижче:
    </p>

    <div style="text-align:center; margin: 26px 0;">
      <a href="${confirmationLink}"
        style="
          background-color: #ED1C24;
          color: #ffffff;
          padding: 14px 26px;
          border-radius: 8px;
          text-decoration: none;
          font-size: 16px;
          display: inline-block;
        ">
        Підтвердити
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; line-height: 1.4; margin-top: 20px;">
      Якщо кнопка не працює, скопіюйте та вставте це посилання у браузер:
      <br />
      <a href="${confirmationLink}" style="color: #ED1C24; word-break: break-all;">
        ${confirmationLink}
      </a>
    </p>

  </div>
  `,
    );
  }

  public async logSubscriptionToFile(
    name: string,
    email: string,
  ): Promise<void> {
    try {
      await this.loggerService.logSubscription(name, email);
      console.log('Лог подписки успешно записан.');
    } catch (error) {
      console.error('Ошибка при записи логов о подписке:', error);
    }
  }

  async unsubscribe(email: string): Promise<Subscription> {
    const subscription = await this.subscriptionModel.findOne({ email });

    if (!subscription) {
      throw new HttpException('Підписника не знайдено', HttpStatus.NOT_FOUND);
    }

    subscription.subscribed = false;
    return subscription.save();
  }
}
