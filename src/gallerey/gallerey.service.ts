import { Logger } from '@nestjs/common';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Gallerey } from './schemas/gallerey.schema';
import { CreateGallereyDto } from './dto/createGallerey.dto';
import { UpdateGallereyDto } from './dto/updateGallerey.dto';
import { LoggerService } from 'src/utils/logging/logger.service';
import { slugify } from 'transliteration';
import { ImageService } from './image.service';
import { ConfigService } from './config';

@Injectable()
export class GallereyService {
  constructor(
    @InjectModel(Gallerey.name) private gallereyModel: Model<Gallerey>,
    private readonly loggerService: LoggerService,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
  ) {}
  async uploadPreviewImage(previewImage: string, title: string) {
    const previewImageObj = await this.imageService.savePreviewImage(
      previewImage,
      title,
    );
    return {
      message: 'Зображення попереднього перегляду успішно завантажено',
      url: previewImageObj.url,
    };
  }

  async findById(id: string): Promise<Gallerey> {
    const gallerey2 = await this.gallereyModel.find().exec();
    console.log(gallerey2);
    const gallerey = await this.gallereyModel.findById(id).exec();
    if (!gallerey) {
      throw new NotFoundException(`Новина з ID ${id} не знайдена`);
    }
    return gallerey;
  }

  private addBaseUrlToImages(gallerey: Gallerey): Gallerey {
    const baseUrl = this.configService.baseUrl;

    if (Array.isArray(gallerey.images)) {
      gallerey.images = gallerey.images.map((image) => `${baseUrl}${image}`);
    } else {
      gallerey.images = [];
    }

    if (gallerey.content) {
      gallerey.content = gallerey.content.replace(
        /src="\/uploads_gallerey\/([^"]+)"/g,
        `src="${baseUrl}/uploads_gallerey/$1"`,
      );
    }

    return gallerey;
  }

  private extractTextFromParagraphs(content: string): string {
    const paragraphRegex = /<p[^>]*>(.*?)<\/p>/g;
    let match: RegExpExecArray | null;
    let paragraphText = '';

    while ((match = paragraphRegex.exec(content)) !== null) {
      paragraphText += match[1];
    }

    paragraphText = paragraphText.replace(/<\/?[^>]+(>|$)/g, '');
    paragraphText = paragraphText.replace(/&[^;]+;/g, '');
    paragraphText = paragraphText.replace(/[\u{1F600}-\u{1F6FF}]/gu, '');
    let preview = paragraphText.trim().substring(0, 100);
    preview += '...';

    return preview;
  }

  async create(createGallereyDto: CreateGallereyDto): Promise<Gallerey> {
    const slug = this.generateSlug(createGallereyDto.title);
    const baseUrl = this.configService.baseUrl;

    const existingGallerey = await this.gallereyModel.findOne({ slug });
    if (existingGallerey) {
      throw new ConflictException(`Новина з ярликом "${slug}" вже існує`);
    }

    let { content } = createGallereyDto;

    const imageRegex = /<img.*?src="([^"]+)".*?>/g;
    const timeRegex = /<time datetime="([^"]+)">/;
    let match: any[];
    const imagePromises = [];

    while ((match = imageRegex.exec(content)) !== null) {
      const imageUrl = match[1];

      if (imageUrl.startsWith('data:image/')) {
        imagePromises.push(
          this.imageService.saveBase64Image(imageUrl, createGallereyDto.title),
        );
      } else {
        imagePromises.push(
          this.imageService.downloadImage(imageUrl, createGallereyDto.title),
        );
      }
    }

    const savedImageObjects = await Promise.all(imagePromises);

    savedImageObjects.forEach((imageObj) => {
      const escapedUrl = imageObj.originalUrl.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      content = content.replace(new RegExp(escapedUrl, 'g'), imageObj.url);
    });

    createGallereyDto.content = content;
    createGallereyDto.images = savedImageObjects.map((image) => image.url);

    const timeMatch = content.match(timeRegex);
    const datetime = timeMatch ? new Date(timeMatch[1]) : null;

    const previewText = this.extractTextFromParagraphs(content);

    const firstImageMatch = content.match(/<img.*?src="([^"]+)".*?>/);
    const previewImg = firstImageMatch
      ? firstImageMatch[1]
      : `src="/preview/qwerty.jpeg"`;

    const gallerey = new this.gallereyModel({
      ...createGallereyDto,
      slug,
      previewText,
      datetime,
      previewImg,
    });

    return gallerey.save();
  }

  async findAll(): Promise<Gallerey[]> {
    const gallereyArray = await this.gallereyModel.find().exec();
    return gallereyArray.map((gallerey) => this.addBaseUrlToImages(gallerey));
  }

  async findBySlug(slug: string): Promise<Gallerey> {
    const gallerey = await this.gallereyModel.findOne({ slug }).exec();
    if (!gallerey) throw new NotFoundException('Gallerey not found');
    return this.addBaseUrlToImages(gallerey);
  }

  async update(
    slug: string,
    updateGallereyDto: UpdateGallereyDto,
  ): Promise<Gallerey> {
    const updatedGallerey = await this.gallereyModel
      .findOneAndUpdate({ slug }, updateGallereyDto, { new: true })
      .exec();
    if (!updatedGallerey) throw new NotFoundException('Gallerey not found');
    return updatedGallerey;
  }

  async delete(slug: string, userId: string): Promise<void> {
    const gallerey = await this.gallereyModel.findOneAndDelete({ slug }).exec();
    if (gallerey) {
      await this.loggerService.logDeletion(gallerey.title, userId);
      console.log('Новина успішно видалена та залогована.');
    } else {
      throw new NotFoundException('Gallerey not found');
    }
  }

  private generateSlug(title: string): string {
    return slugify(title, { lowercase: true })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async incrementViews(slug: string): Promise<void> {
    const result = await this.gallereyModel
      .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Новини не знайдено');
    }
  }
}
