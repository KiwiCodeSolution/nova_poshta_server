import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Ppo } from 'src/ppo/schemas/ppo.schema';
import { LoggerService } from 'src/utils/logging/logger.service';
import { slugify } from 'transliteration';
import { Gallerey } from '../gallerey/schemas/gallerey.schema';
import { MailerService } from '../mailer/mailer.service';
import { PpoService } from '../ppo/ppo.service';
import { Subscription } from '../subscriptions/schemas/subscription.schema';
import { ConfigService } from './config';
import { CreateNewsDto } from './dto/createNews.dto';
import { UpdateNewsDto } from './dto/updateNews.dto';
import { ImageService } from './image.service';
import { News } from './schemas/news.schema';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(Ppo.name) private ppoModel: Model<Ppo>,
    @InjectModel(Gallerey.name) private galleryModel: Model<Gallerey>,
    @InjectModel(Subscription.name)
    private subscriptionModel: Model<Subscription>,
    private readonly mailerService: MailerService,
    private readonly loggerService: LoggerService,
    private readonly imageService: ImageService,
    private readonly configService: ConfigService,
    private readonly ppoService: PpoService,
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

  async findById(id: string): Promise<News> {
    const news2 = await this.newsModel.find().exec();
    console.log(news2);
    const news = await this.newsModel.findById(id).exec();
    if (!news) {
      throw new NotFoundException(`Новина з ID ${id} не знайдена`);
    }
    return news;
  }

  private addBaseUrlToImages(news: News): News {
    const baseUrl = this.configService.baseUrl;

    if (Array.isArray(news.images)) {
      news.images = news.images.map((image) => `${baseUrl}${image}`);
    } else {
      news.images = [];
    }

    if (news.content) {
      news.content = news.content.replace(
        /src="\/uploads\/([^"]+)"/g,
        `src="${baseUrl}/uploads/$1"`,
      );
    }

    return news;
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

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const slug = this.generateSlug(createNewsDto.title);
    // const baseUrl = this.configService.baseUrl;

    const existingNews = await this.newsModel.findOne({ slug });
    if (existingNews) {
      throw new ConflictException(`Новина з ярликом "${slug}" вже існує`);
    }

    let { content } = createNewsDto;
    const imageRegex = /<img.*?src="([^"]+)".*?>/g;
    const timeRegex = /<time datetime="([^"]+)">/;
    let match: any[];
    const imagePromises = [];

    while ((match = imageRegex.exec(content)) !== null) {
      const imageUrl = match[1];

      if (imageUrl.startsWith('data:image/')) {
        imagePromises.push(
          this.imageService.saveBase64Image(imageUrl, createNewsDto.title),
        );
      } else {
        imagePromises.push(
          this.imageService.downloadImage(imageUrl, createNewsDto.title),
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

    createNewsDto.content = content;
    createNewsDto.images = savedImageObjects.map((image) => image.url);
    const timeMatch = content.match(timeRegex);
    const datetime = timeMatch ? new Date(timeMatch[1]) : null;
    const previewText = this.extractTextFromParagraphs(content);

    const firstImageMatch = content.match(/<img.*?src="([^"]+)".*?>/);
    const previewImg = firstImageMatch
      ? firstImageMatch[1]
      : `src="/preview/qwerty.jpeg"`;

    const news = new this.newsModel({
      ...createNewsDto,
      slug,
      previewText,
      datetime,
      previewImg,
    });

    const savedNews = await news.save();

    await this.sendNewsToSubscribers(savedNews);

    return savedNews;
  }

  private async sendNewsToSubscribers(news: News): Promise<void> {
    const subscribers = await this.subscriptionModel.find({ subscribed: true });
    const newsLink = `${this.configService.frontendBaseUrl}/uk/novyny/${news.slug}`;

    const emailPromises = subscribers.map((subscriber) => {
      const unsubscribeLink = `${this.configService.frontendBaseUrl}/uk/subscription/unsubscribe?email=${subscriber.email}`;

      return this.mailerService.sendMail(
        subscriber.email,
        `Нова публікація: ${news.title}`,
        `Деталі публікації доступні за посиланням: ${newsLink}`,
        `
      <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; font-family: 'Segoe UI', Arial, sans-serif; color: #111827;">

        <div style="text-align:center; margin-bottom: 24px;">
          <h1 style="font-size: 26px; margin: 0; color: #ED1C24; font-weight: 700;">Нове оновлення на сайті</h1>
        </div>

        <p style="font-size: 17px; line-height: 1.6; margin-bottom: 10px;">
          На <b>profspilka.org</b> є нова публікація:
        </p>

        <div style="background: #f9fafb; padding: 16px 20px; border-radius: 10px; border-left: 4px solid #ED1C24; margin: 20px 0;">
          <h2 style="font-size: 20px; margin: 0; font-weight: 600;">${news.title}</h2>
        </div>

        <p style="font-size: 16px; line-height: 1.5;">
          Натисніть кнопку, щоб переглянути деталі:
        </p>

        <div style="text-align:center; margin: 28px 0;">
          <a href="${newsLink}" style="display: inline-block; padding: 14px 26px; background-color: #ED1C24; color: #ffffff !important; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
            Читати
          </a>
        </div>

        <p style="font-size: 14px; color: #6b7280; line-height: 1.5;">
          Якщо кнопка не працює, відкрийте посилання вручну:
          <br />
          <a href="${newsLink}" style="color: #ED1C24; word-break: break-all;">${newsLink}</a>
        </p>



        <hr style="border:none; border-top:1px solid #e5e7eb; margin: 28px 0;" />

        <p style="text-align:center; font-size: 12px; color: #9ca3af; margin-top: 0;">
          Ви отримали цей лист, бо підписані на оновлення сайту profspilka.org.
          <br />
          Якщо це помилка — просто ігноруйте.
             <br />
          Щоб відписатися, натисніть кнопку нижче:
        </p>

                <!-- Кнопка відписки -->
        <div style="text-align:center; margin: 10px 0 8px;">
          <a href="${unsubscribeLink}" style="display:inline-block; padding: 8px 20px; background:#6b7280; color:#fff !important; text-decoration:none; border-radius:6px; font-size:14px;">
            Відписатися
          </a>
        </div>

      </div>
      `,
      );
    });

    try {
      await Promise.all(emailPromises);
      console.log('Розсилка новин успішно виконана');
    } catch (error) {
      console.error('Помилка під час розсилки новин:', error);
    }
  }

  async searchNews(searchParams: any): Promise<any[]> {
    const { query, date, topic } = searchParams;
    const logger = new Logger('NewsService');
    const newsFilters: any = {};
    const ppoFilters: any = {};
    const galleryFilters: any = {};

    if (query) {
      newsFilters.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { sections: { $regex: query, $options: 'i' } },
      ];
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      newsFilters.createdAt = { $gte: startDate, $lte: endDate };
    }
    if (topic) {
      newsFilters.sections = { $in: [topic] };
    }

    if (query) {
      ppoFilters.$or = [
        { region: { $regex: query.trim(), $options: 'i' } },
        { region_name: { $regex: query.trim(), $options: 'i' } },
        { director: { $regex: query.trim(), $options: 'i' } },
        { position: { $regex: query.trim(), $options: 'i' } },
        { email: { $regex: query.trim(), $options: 'i' } },
        { phone: { $regex: query.trim(), $options: 'i' } },
        { admission_address: { $regex: query.trim(), $options: 'i' } },
        { application_address: { $regex: query.trim(), $options: 'i' } },
        { link_news: { $regex: query.trim(), $options: 'i' } },
        { link: { $regex: query.trim(), $options: 'i' } },
        { committee: { $regex: query.trim(), $options: 'i' } },
      ];
    }

    if (query) {
      galleryFilters.$or = [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { sections: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ];
    }
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      galleryFilters.datetime = { $gte: startDate, $lte: endDate };
    }
    if (topic) {
      galleryFilters.sections = { $in: [topic] };
    }

    try {
      // Поиск в коллекциях
      const [newsResults, ppoResults, galleryResults] = await Promise.all([
        this.newsModel.find(newsFilters).exec(),
        this.ppoModel.find(ppoFilters).exec(),
        this.galleryModel.find(galleryFilters).exec(),
      ]);

      logger.log(`Found News results: ${newsResults.length}`);
      logger.log(`Found PPO results: ${ppoResults.length}`);
      logger.log(`Found Gallery results: ${galleryResults.length}`);

      // Возврат объединённых результатов
      return [...newsResults, ...ppoResults, ...galleryResults];
    } catch (error) {
      logger.error(`Error during search: ${error.message}`);
      throw error;
    }
  }

  async findWithFilters(filters: any): Promise<any[]> {
    console.log('Applied Filters:', filters);
    const results = await this.ppoModel.find(filters).exec();
    return results;
  }

  async findAll(): Promise<News[]> {
    const newsArray = await this.newsModel.find().exec();
    return newsArray.map((news) => this.addBaseUrlToImages(news));
  }

  async findBySlug(slug: string): Promise<News> {
    const news = await this.newsModel.findOne({ slug }).exec();
    if (!news) throw new NotFoundException('News not found');
    return this.addBaseUrlToImages(news);
  }

  // async update(slug: string, updateNewsDto: UpdateNewsDto): Promise<News> {
  //     const updatedNews = await this.newsModel
  //         .findOneAndUpdate({ slug }, updateNewsDto, { new: true })
  //         .exec();
  //     if (!updatedNews) throw new NotFoundException('News not found');
  //     return updatedNews;
  // }
  async update(slug: string, updateNewsDto: UpdateNewsDto): Promise<News> {
    if (updateNewsDto.content) {
      const previewText = this.extractTextFromParagraphs(updateNewsDto.content);
      updateNewsDto.previewText = previewText;
    }

    const updatedNews = await this.newsModel
      .findOneAndUpdate({ slug }, updateNewsDto, { new: true })
      .exec();

    if (!updatedNews) {
      throw new NotFoundException('News not found');
    }

    return updatedNews;
  }

  async delete(slug: string, userId: string): Promise<void> {
    const news = await this.newsModel.findOneAndDelete({ slug }).exec();
    if (news) {
      await this.loggerService.logDeletion(news.title, userId);
      console.log('Новина успішно видалена та залогована.');
    } else {
      throw new NotFoundException('News not found');
    }
  }

  private generateSlug(title: string): string {
    return slugify(title, { lowercase: true })
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async incrementViews(slug: string): Promise<void> {
    const result = await this.newsModel
      .findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Новини не знайдено');
    }
  }
}
``;
