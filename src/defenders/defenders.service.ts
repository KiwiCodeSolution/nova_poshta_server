import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDefenderDto } from './dto/create-defender.dto';
import { UpdateDefenderDto } from './dto/update-defender.dto';
import { Defender } from './schenas/defender.schema';

@Injectable()
export class DefendersService {
  constructor(
    @InjectModel(Defender.name)
    private defenderModel: Model<Defender>,
  ) {}

  async create(dto: CreateDefenderDto, file?: Express.Multer.File) {
    const imagePath = file ? `/uploads/${file.filename}` : null;

    return this.defenderModel.create({
      ...dto,
      image: imagePath,
    });
  }

  async findAll() {
    const items = await this.defenderModel.find().exec();

    return items;
  }

  async findActive() {
    return this.defenderModel.find({ is_active: true }).exec();
  }

  async findOne(id: string) {
    const item = await this.defenderModel.findById(id).exec();
    if (!item) throw new NotFoundException('Defender not found');
    return item;
  }

  async update(id: string, dto: UpdateDefenderDto, file?: Express.Multer.File) {
    const defender = await this.defenderModel.findById(id);

    if (!defender) throw new NotFoundException('Defender not found');

    // Оновлення картинки, якщо є файл
    if (file) {
      defender.image = `/uploads/${file.filename}`;
    }

    // Оновлюємо тільки ті поля, які присутні у dto
    for (const key of Object.keys(dto)) {
      if (dto[key] !== undefined) {
        defender[key] = dto[key];
      }
    }
    const result = await defender.save();

    return result;
  }

  async remove(id: string) {
    const deleted = await this.defenderModel.findByIdAndDelete(id).exec();
    if (!deleted) throw new NotFoundException('Defender not found');
    return deleted;
  }

  async setActive(id: string, is_active: boolean) {
    const updated = await this.defenderModel
      .findByIdAndUpdate(id, { is_active }, { new: true })
      .exec();

    if (!updated) throw new NotFoundException('Defender not found');
    return updated;
  }

  async toggleActive(id: string) {
    const item = await this.findOne(id);
    item.is_active = !item.is_active;
    return item.save();
  }
}
