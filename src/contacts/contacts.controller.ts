import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto, UpdateContactDto } from './dto/createContact.dto';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.createContact(createContactDto);
  }

  @Put()
  async update(@Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.updateSingleContact(updateContactDto);
  }
  @Get()
  async getAllContacts() {
    return this.contactsService.getAllContacts();
  }

  @Get(':id')
  async getContactById(@Param('id') id: string) {
    return this.contactsService.getContactById(id);
  }
}
