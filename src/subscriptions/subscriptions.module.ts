import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { SubscriptionController } from './subscriptions.controller';
import { SubscriptionService } from './subscriptions.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionSchema } from './schemas/subscription.schema';
import { LoggerService } from 'src/utils/logging/logger.service';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Subscription', schema: SubscriptionSchema },
    ]),
    MailModule,
  ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, LoggerService],
  exports: [MongooseModule],
})
export class SubscriptionsModule {}
