import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { GallereyService } from './gallerey.service';
import { CreateGallereyDto } from './dto/createGallerey.dto';
import { UpdateGallereyDto } from './dto/updateGallerey.dto';

@Controller('gallerey')
export class GallereyController {
  constructor(private readonly gallereyService: GallereyService) {}

  // @Post('upload-preview')
  // async uploadPreviewImage(@Body() body: { previewImage: string, title: string }) {
  //   return this.newsService.uploadPreviewImage(body.previewImage, body.title);
  // }

  @Get('id/:id')
  async findById(@Param('id') id: string) {
    return this.gallereyService.findById(id);
  }

  @Post()
  create(@Body() createGallereyDto: CreateGallereyDto) {
    return this.gallereyService.create(createGallereyDto);
  }

  @Get()
  findAll() {
    return this.gallereyService.findAll();
  }

  @Get(':slug')
  async findBySlug(@Param('slug') slug: string) {
    await this.gallereyService.incrementViews(slug);
    return this.gallereyService.findBySlug(slug);
  }

  @Put(':slug')
  update(
    @Param('slug') slug: string,
    @Body() updateGallereyDto: UpdateGallereyDto,
  ) {
    return this.gallereyService.update(slug, updateGallereyDto);
  }

  @Delete(':slug/:userId')
  delete(@Param('slug') slug: string, @Param('userId') userId: string) {
    return this.gallereyService.delete(slug, userId);
  }
}
