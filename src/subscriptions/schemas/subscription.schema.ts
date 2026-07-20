import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ required: false })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: false })
  subscribed: boolean;

  @Prop({ type: [String], required: false })
  array_subscripts: string[];

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
