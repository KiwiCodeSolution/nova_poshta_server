import { Module } from '@nestjs/common';
import { GallereyController } from './gallerey.controller';
import { GallereyService } from './gallerey.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Gallerey, GallereySchema } from './schemas/gallerey.schema';
import { LoggerService } from 'src/utils/logging/logger.service';
import { ImageService } from './image.service';
import { ConfigService } from './config';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Gallerey.name, schema: GallereySchema },
    ]),
  ],
  controllers: [GallereyController],
  providers: [GallereyService, LoggerService, ImageService, ConfigService],
  exports: [GallereyService, MongooseModule],
})
export class GallereyModule {}
