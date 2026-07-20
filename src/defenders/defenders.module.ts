import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DefendersController } from './defenders.controller';
import { DefendersService } from './defenders.service';
import { Defender, DefenderSchema } from './schenas/defender.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Defender.name, schema: DefenderSchema },
    ]),
  ],
  controllers: [DefendersController],
  providers: [DefendersService],
  exports: [DefendersService],
})
export class DefendersModule {}
