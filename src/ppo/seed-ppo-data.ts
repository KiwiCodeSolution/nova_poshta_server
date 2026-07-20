import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { PpoService } from './ppo.service';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ppoService = app.get(PpoService);

  const filePath = path.join(__dirname, './ppo.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  for (const item of data) {
    await ppoService.create(item);
  }

  await app.close();
}

bootstrap();
