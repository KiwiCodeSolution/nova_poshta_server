import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { storage } from './multer.config';
import { PpoService } from './ppo.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('ppo')
export class PpoController {
  constructor(private readonly ppoService: PpoService) {}

  @Post()
  async create(@Body() createPpoDto: CreatePpoDto) {
    return this.ppoService.create(createPpoDto);
  }

  @Get()
  async findAll() {
    return this.ppoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.ppoService.findOne(id);
  }

  @Get('link/:slug')
  async findOneByLink(@Param('slug') slug: string) {
    // додаємо /ppo/ до slug, бо у полі link так зберігається
    const link = `/ppo/${slug}`;
    return this.ppoService.findOneByLink(link);
  }

  // @Put(':id')
  // async update(@Param('id') id: string, @Body() updatePpoDto: UpdatePpoDto) {
  //   return this.ppoService.update(id, updatePpoDto);
  // }

  @Put(':id')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'image', maxCount: 1 },
        { name: 'avatar', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './ppo_images',
          filename: (req, file, callback) => {
            // Отримуємо назву регіону з тіла запиту
            const regionName = req.body.place || 'unknown';
            // Назву файлу беремо з `originalname`
            const originalname = file.originalname;
            // Ви можете додати й інші поля для унікальності
            const uniqueSuffix =
              Date.now() + '-' + Math.round(Math.random() * 1e9);
            const extension = extname(originalname);

            callback(null, `${regionName}-${uniqueSuffix}${extension}`);
          },
        }),
      },
    ),
  )
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ppoService.remove(id);
  }
}
