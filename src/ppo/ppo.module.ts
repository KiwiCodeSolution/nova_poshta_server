import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PpoController } from './ppo.controller';
import { PpoService } from './ppo.service';
import { Ppo, PpoSchema } from './schemas/ppo.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Ppo.name, schema: PpoSchema }])],
  controllers: [PpoController],
  providers: [PpoService],
  exports: [PpoService, MongooseModule],
})
export class PpoModule {}
