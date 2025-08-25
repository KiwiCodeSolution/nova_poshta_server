import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Get,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { Express } from 'express';
import { join } from 'path';
import { Response } from 'express';

// http://localhost:5000/api/files/qwerty.jpeg
// http://localhost:5000/api/files/1.pdf
// Женя по таким путям відает файли ))))

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './doc',
        filename: (req, file, cb) => {
          const fileName = file.originalname;
          cb(null, fileName);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          cb(new Error('Недопустимий формат файлу'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      return this.filesService.handleFileUpload(file);
    } catch (error) {
      console.error('Помилка завантаження файлу:', error.message);
      throw new HttpException(
        'Не вдалося завантажити файл',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = join(process.cwd(), 'doc', filename);
    return res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Помилка при відправці файлу:', err);
        res.status(HttpStatus.NOT_FOUND).send('Файл не знайдено');
      }
    });
  }

  @Delete('delete/:filename')
  async deleteFile(@Param('filename') filename: string) {
    return this.filesService.deleteFile(filename);
  }
}
