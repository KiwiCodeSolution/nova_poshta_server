import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './schemas/subscription.schema';
import { CreateSubscriptionDto } from './dto/create_subscription.dto';
import { MailerService } from '../mailer/mailer.service';
import { LoggerService } from 'src/utils/logging/logger.service';
import { UpdateSubscriptDto } from './dto/update_subscript.dto';

@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Subscription.name) private subscriptionModel: Model<Subscription>,
        private readonly mailerService: MailerService,
        private readonly loggerService: LoggerService
    ) { }

    async createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<Subscription> {
        const newSubscription = new this.subscriptionModel(createSubscriptionDto);
        this.logSubscriptionToFile(newSubscription.name, newSubscription.email);
        await this.sendConfirmationEmail(newSubscription.email);
        return newSubscription.save();
    }

    async getSubscribedUsers(): Promise<Subscription[]> {
        return this.subscriptionModel.find({ subscribed: true });
    }
    

      async updateSubscription(updateSubscriptionDto: UpdateSubscriptDto): Promise<Subscription> {
        const { email, subscribed } = updateSubscriptionDto;
    
        const subscription = await this.subscriptionModel.findOne({ email });
        if (!subscription) {
          throw new HttpException('Подписка не найдена', HttpStatus.NOT_FOUND);
        }
    
        subscription.subscribed = subscribed;
        return subscription.save();
      }


    // async confirmSubscription(email: string): Promise<Subscription> {
    //     const subscription = await this.subscriptionModel.findOne({ email });

    //     if (!subscription) {
    //         throw new Error('Subscription not found');
    //     }
    //     subscription.subscribed = true;
    //     return subscription.save();
    // }

    async confirmSubscription(email: string): Promise<Subscription> {
        const subscription = await this.subscriptionModel.findOne({ email });
        if (!subscription) {
            throw new HttpException('Подписка не найдена', HttpStatus.NOT_FOUND);
        }
        subscription.subscribed = !subscription.subscribed;
        return subscription.save();
    }
    private async sendConfirmationEmail(email: string) {
        const confirmationLink = `https://kiwicode.digital/subscription/confirm?email=${email}`;
        console.log(email);
        await this.mailerService.sendMail(
            email,
            'Подтверждение подписки на новости',
            `Для подтверждения подписки перейдите по ссылке: ${confirmationLink}`,
            `<p>Для подтверждения подписки перейдите по ссылке: <a href="${confirmationLink}">${confirmationLink}</a></p>`,
        );
    }

    public async logSubscriptionToFile(name: string, email: string): Promise<void> {
        try {
            await this.loggerService.logSubscription(name, email);
            console.log('Лог подписки успешно записан.');
        } catch (error) {
            console.error('Ошибка при записи логов о подписке:', error);
        }
    }
}
