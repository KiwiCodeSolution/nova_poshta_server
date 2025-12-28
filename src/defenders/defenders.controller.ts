import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { DefendersService } from './defenders.service';
import { CreateDefenderDto } from './dto/create-defender.dto';
import { UpdateDefenderDto } from './dto/update-defender.dto';

@Controller('defenders')
export class DefendersController {
  constructor(private readonly defendersService: DefendersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, unique + extname(file.originalname));
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateDefenderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.defendersService.create(dto, file);
  }

  @Get()
  findAll() {
    return this.defendersService.findAll();
  }

  @Get('active')
  findActive() {
    return this.defendersService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.defendersService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDefenderDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.defendersService.update(id, dto, file);
  }

  @Patch(':id/hide')
  hide(@Param('id') id: string) {
    return this.defendersService.setActive(id, false);
  }

  @Patch(':id/show')
  show(@Param('id') id: string) {
    return this.defendersService.setActive(id, true);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.defendersService.toggleActive(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.defendersService.remove(id);
  }
}
