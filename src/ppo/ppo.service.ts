import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { UpdatePpoDto } from './dto/update-ppo.dto';
import { Ppo } from './schemas/ppo.schema';

@Injectable()
export class PpoService {
  constructor(@InjectModel(Ppo.name) private ppoModel: Model<Ppo>) {}

  async create(createPpoDto: CreatePpoDto): Promise<Ppo> {
    const createdPpo = new this.ppoModel(createPpoDto);
    return createdPpo.save();
  }

  async findAll(): Promise<Ppo[]> {
    return this.ppoModel.find().exec();
  }

  async findOne(id: string): Promise<Ppo> {
    const ppo = await this.ppoModel.findById(id).exec();
    if (!ppo) {
      throw new NotFoundException(`ППО з ID ${id} не знайдено`);
    }
    return ppo;
  }

  async findOneByLink(link: string): Promise<Ppo> {
    const ppo = await this.ppoModel.findOne({ link }).exec();
    if (!ppo) {
      throw new NotFoundException(`ППО з link ${link} не знайдено`);
    }
    return ppo;
  }

  async update(id: string, updatePpoDto: UpdatePpoDto): Promise<Ppo> {
    const updatedPpo = await this.ppoModel
      .findByIdAndUpdate(id, updatePpoDto, {
        new: true,
        runValidators: true,
      })
      .exec();
    if (!updatedPpo) {
      throw new NotFoundException(`ППО з ID ${id} не знайдено`);
    }
    return updatedPpo;
  }

  async remove(id: string): Promise<void> {
    const result = await this.ppoModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`ППО з ID ${id} не знайдено`);
    }
  }

  async updateWithFiles(
    id: string,
    updatePpoData: Record<string, any>, // <--- Змінено тут
    imageFile?: Express.Multer.File,
    avatarFile?: Express.Multer.File,
  ): Promise<Ppo> {
    // 1. Створюємо об'єкт для оновлення.
    const updateData: Record<string, any> = { ...updatePpoData };

    // 2. Додаємо шляхи до файлів, якщо вони присутні.
    if (imageFile) {
      updateData.image = `/images/ppo/${imageFile.filename}`;
    }

    if (avatarFile) {
      updateData.avatar = `/images/ppo/${avatarFile.filename}`;
    }

    // 3. Виконуємо оновлення.
    const updatedPpo = await this.ppoModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedPpo) {
      throw new NotFoundException(`ППО з ID ${id} не знайдено`);
    }
    return updatedPpo;
  }
}
