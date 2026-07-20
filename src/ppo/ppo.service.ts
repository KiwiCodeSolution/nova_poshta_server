import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePpoDto } from './dto/create-ppo.dto';
import { UpdatePpoDto } from './dto/update-ppo.dto';
import { Ppo } from './schemas/ppo.schema';

import * as fs from 'fs';
import * as path from 'path';

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
    updatePpoData: Record<string, any>,
    imageFile?: Express.Multer.File,
    avatarFile?: Express.Multer.File,
  ): Promise<Ppo> {
    const existing = await this.ppoModel.findById(id);

    if (!existing) {
      throw new NotFoundException(`ППО з ID ${id} не знайдено`);
    }

    const updateData = { ...updatePpoData };

    // -------- IMAGE --------
    if (imageFile) {
      this.deleteIfExists(existing.image);
      updateData.image = `/images/ppo/${imageFile.filename}`;
    }

    // -------- AVATAR --------
    if (avatarFile) {
      this.deleteIfExists(existing.avatar);
      updateData.avatar = `/images/ppo/${avatarFile.filename}`;
    }

    const updated = await this.ppoModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updated;
  }

  private deleteIfExists(filePath?: string) {
    if (!filePath) return;

    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
