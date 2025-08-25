import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';
import { NewsService } from './news.service';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.schema';
import { LoggerService } from 'src/utils/logging/logger.service';
import { ImageService } from './image.service';
import { ConfigService } from './config';
import { PpoModule } from 'src/ppo/ppo.module';
import { GallereyModule } from '../gallerey/gallerey.module';
import { GallereyService } from 'src/gallerey/gallerey.service';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';
import { MailerService } from 'src/mailer/mailer.service';
import { MailModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
    PpoModule,
    GallereyModule,
    SubscriptionsModule,
    MailModule,
  ],
  controllers: [NewsController],
  providers: [NewsService, LoggerService, ImageService, ConfigService],
})
export class NewsModule {}
