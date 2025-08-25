import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { ContactsModule } from './contacts/contacts.module';
import { FilesController } from './files/files.controller';
import { FilesModule } from './files/files.module';
import { GallereyModule } from './gallerey/gallerey.module';
import { MailerController } from './mailer/mailer.controller';
import { MailModule } from './mailer/mailer.module';
import { MailerService } from './mailer/mailer.service';
import { NewsModule } from './news/news.module';
import { PpoController } from './ppo/ppo.controller';
import { PpoModule } from './ppo/ppo.module';
import { PpoService } from './ppo/ppo.service';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost/nova_poshta_prod'),
    MongooseModule.forRoot(
      'mongodb+srv://ea_admin:123456_ea_admin@cluster0.kkd7c.mongodb.net/',
    ),
    UserModule,
    PpoModule,
    AuthModule,
    MailModule,
    NewsModule,
    GallereyModule,
    ContactsModule,
    SubscriptionsModule,
    FilesModule,
    MailerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads_gallerey'),
      serveRoot: '/uploads_gallerey/',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'preview'),
      serveRoot: '/preview',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ppo_images'),
      serveRoot: '/ppo_images',
    }),
  ],
  controllers: [MailerController, FilesController, PpoController],

  providers: [MailerService, PpoService],
})
export class AppModule {}
