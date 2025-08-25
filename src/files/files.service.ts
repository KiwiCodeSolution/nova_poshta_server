import { Injectable } from '@nestjs/common';
import { unlinkSync, existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  private readonly uploadPath = join(process.cwd(), '..', 'doc');

  handleFileUpload(file: Express.Multer.File) {
    const filePath = join(this.uploadPath, file.originalname);

    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        console.log(`Старий файл ${file.originalname} видалено`);
      } catch (error) {
        console.error('Помилка при видаленні старого файлу:', error);
      }
    }

    return {
      message: 'Файл успішно завантажено або оновлено',
      fileName: file.originalname,
    };
  }

  deleteFile(filename: string) {
    const filePath = join(this.uploadPath, filename);

    if (existsSync(filePath)) {
      try {
        unlinkSync(filePath);
        return { message: `Файл ${filename} успішно видалено` };
      } catch (error) {
        console.error('Помилка при видаленні файлу:', error);
        return { message: 'Не вдалося видалити файл', error: error.message };
      }
    } else {
      return { message: `Файл ${filename} не знайдено` };
    }
  }
}
