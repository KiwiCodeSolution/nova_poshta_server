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
import { diskStorage } from 'multer';
import * as path from 'path';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { UpdatePpoDto } from './dto/update-ppo.dto';
import { PpoService } from './ppo.service';

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

  @Put(':id/:link')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'avatar', maxCount: 1 },
        { name: 'image', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: './images/ppo',
          filename: (req, file, callback) => {
            const { link } = req.params;
            const extension = path.parse(file.originalname).ext;

            if (file.fieldname === 'avatar') {
              callback(null, `${link}-avatar${extension}`);
            } else if (file.fieldname === 'image') {
              callback(null, `${link}${extension}`);
            } else {
              callback(null, file.originalname);
            }
          },
        }),
      },
    ),
  )
  update(
    @Param('id') id: string,
    @UploadedFiles()
    files: { avatar?: Express.Multer.File[]; image?: Express.Multer.File[] },
    @Body() updatePpoDto: UpdatePpoDto,
  ) {
    const avatarFile = files.avatar ? files.avatar[0] : null;
    const imageFile = files.image ? files.image[0] : null;

    const updateData: Record<string, any> = { ...updatePpoDto };

    if (avatarFile) {
      updateData.avatar = `/images/ppo/${avatarFile.filename}`;
    }

    if (imageFile) {
      updateData.image = `/images/ppo/${imageFile.filename}`;
    }

    return this.ppoService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ppoService.remove(id);
  }
}
