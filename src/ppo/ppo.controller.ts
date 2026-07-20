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
          filename: (req, file, cb) => {
            const rawLink = req.params.link;
            const safeLink = rawLink.replace(/[\/\\]/g, '-');
            const ext = path.extname(file.originalname);
            const unique = Date.now();

            if (file.fieldname === 'avatar') {
              cb(null, `${safeLink}-avatar-${unique}${ext}`);
            } else {
              cb(null, `${safeLink}-${unique}${ext}`);
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
    @Body() dto: UpdatePpoDto,
  ) {
    return this.ppoService.updateWithFiles(
      id,
      dto,
      files.image?.[0],
      files.avatar?.[0],
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.ppoService.remove(id);
  }
}
