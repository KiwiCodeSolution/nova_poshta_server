import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Ppo extends Document {
  @Prop()
  region: string;

  @Prop()
  region_name: string;

  @Prop()
  quantity: number;

  @Prop()
  image: string;

  @Prop()
  director: string;

  @Prop()
  position: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop()
  admission_address: string;

  @Prop()
  application_address: string;

  @Prop([String])
  committee: string[];

  @Prop()
  link_news: string;

  @Prop()
  link: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const PpoSchema = SchemaFactory.createForClass(Ppo);
