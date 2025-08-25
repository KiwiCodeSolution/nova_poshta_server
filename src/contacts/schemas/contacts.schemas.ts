import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Contacts extends Document {
  @Prop({ unique: true })
  mail: string;

  @Prop({ unique: true })
  telegram: string;

  @Prop({ unique: true })
  viber: string;

  @Prop({ unique: true })
  messenger: string;

  @Prop({ unique: true })
  instagram: string;

  @Prop({ unique: true })
  youtube: string;

  @Prop({ unique: true })
  facebook: string;
}

export const ContactsSchema = SchemaFactory.createForClass(Contacts);
