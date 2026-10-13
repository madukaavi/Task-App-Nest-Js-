
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop({
    required: true,
    trim: true,
    maxlength: 100,
  })
  title: string;

  @Prop({
    default: '',
    maxlength: 500,
  })
  description: string;

  @Prop({
    default: false,
  })
  completed: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
