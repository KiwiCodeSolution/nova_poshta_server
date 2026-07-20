import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { format } from 'date-fns';
import axios from 'axios';
import { slugify } from 'transliteration';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from './config';

@Injectable()
export class ImageService {
  private uploadDir = path.join(__dirname, '..', '..', 'uploads_gallerey');
  constructor(private readonly configService: ConfigService) {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        fs.mkdirSync(this.uploadDir, { recursive: true });
      }
    } catch (err) {
      throw new Error(`Не удалось создать директорию загрузок: ${err.message}`);
    }
  }

  async savePreviewImage(base64String: string, title: string) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const slug = title
      ? slugify(title.toLowerCase().replace(/\s+/g, '-'))
      : 'image';
    const timestamp = format(new Date(), 'yyyyMMddHHmmssSS');
    const randomNumber = Math.floor(10 + Math.random() * 90);
    const filename = `${slug}-preview-${timestamp}-${randomNumber}.jpg`;
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.promises.mkdir(this.uploadDir, { recursive: true });
      await fs.promises.writeFile(filepath, buffer);
      const fullUrl = `/uploads_gallerey/${filename}`;
      return { originalUrl: base64String, filename, url: fullUrl };
    } catch (err) {
      throw new Error(`Failed to save preview image: ${err.message}`);
    }
  }

  async saveBase64Image(base64String: string, title: string) {
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const slug = title
      ? slugify(title.toLowerCase().replace(/\s+/g, '-'))
      : 'image';
    const timestamp = format(new Date(), 'yyyyMMddHHmmssSS');
    // const uniqueId = uuidv4().slice(0, 4);
    const randomNumber = Math.floor(10 + Math.random() * 90);
    const filename = `${slug}-${timestamp}-${randomNumber}.jpg`;
    const filepath = path.join(this.uploadDir, filename);

    try {
      await fs.promises.mkdir(this.uploadDir, { recursive: true });
      await fs.promises.writeFile(filepath, buffer);
      const fullUrl = `/uploads_gallerey/${filename}`;
      return { originalUrl: base64String, filename, url: fullUrl };
    } catch (err) {
      throw new Error(`Failed to save image: ${err.message}`);
    }
  }

  async downloadImage(imageUrl: string, title: string) {
    const baseUrl = this.configService.baseUrl;
    // const fileExtension = path.extname(imageUrl) || '.jpg';
    const slug = title
      ? slugify(title.toLowerCase().replace(/\s+/g, '-'))
      : 'image';
    const timestamp = format(new Date(), 'yyyyMMddHHmmssSS');
    const randomNumber = Math.floor(10 + Math.random() * 90);
    const filename = `${slug}-${timestamp}-${randomNumber}.jpg`;
    const filepath = path.join(this.uploadDir, filename);

    try {
      const response = await axios({
        url: imageUrl,
        method: 'GET',
        responseType: 'stream',
      });

      response.data.pipe(fs.createWriteStream(filepath));

      return new Promise((resolve, reject) => {
        response.data.on('end', () => {
          const fullUrl = `/uploads_gallerey/${filename}`;
          resolve({ originalUrl: imageUrl, filename, url: fullUrl });
        });

        response.data.on('error', (err) => {
          reject(new Error(`Failed to download image: ${err.message}`));
        });
      });
    } catch (err) {
      throw new Error(`Failed to download image: ${err.message}`);
    }
  }
}
