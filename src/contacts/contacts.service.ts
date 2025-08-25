import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Contacts } from './schemas/contacts.schemas';
import { CreateContactDto, UpdateContactDto } from './dto/createContact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contacts.name) private readonly contactsModel: Model<Contacts>,
  ) {}

  async createContact(createContactDto: CreateContactDto): Promise<Contacts> {
    const createdContact = new this.contactsModel(createContactDto);
    return createdContact.save();
  }

  async updateSingleContact(
    updateContactDto: UpdateContactDto,
  ): Promise<Contacts> {
    const updatedContact = await this.contactsModel
      .findOneAndUpdate({}, updateContactDto, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updatedContact) {
      throw new NotFoundException(`Contact not found`);
    }

    return updatedContact;
  }

  async getAllContacts(): Promise<Contacts[]> {
    return this.contactsModel.find().exec();
  }

  async getContactById(id: string): Promise<Contacts> {
    const contact = await this.contactsModel.findById(id).exec();
    if (!contact) {
      throw new NotFoundException(`Contact with ID ${id} not found`);
    }
    return contact;
  }
}
