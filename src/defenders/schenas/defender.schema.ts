import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Defender extends Document {
  @Prop({ required: true })
  titleUk: string;

  @Prop({ required: true })
  titleEn: string;

  @Prop({ required: true })
  descriptionUk: string;

  @Prop({ required: true })
  descriptionEn: string;

  @Prop({ required: true })
  goalUk: string;

  @Prop({ required: true })
  goalEn: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  link: string;

  @Prop({ default: true })
  is_active: boolean;
}

export const DefenderSchema = SchemaFactory.createForClass(Defender);
