import { Application } from '../declarations';
import { Document, Model, Mongoose } from 'mongoose';
import { User } from './users.model';

export interface Course extends Document {
  userId: User['_id'];
  courseSigaId: string;
  name: string;
  colour: string;
  course: string;
  shift: string;
  classroom: string;
  campus: string;
  day: number[];
  startHour: string[];
  finishHour: string[];
  state: string;
}

const stringRequired = { type: String, required: true };

export default function (app: Application): Model<Course> {
  const modelName = 'courses';
  const mongooseClient: Mongoose = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: 'users' },
      courseSigaId: stringRequired, // 082020
      name: stringRequired, // Matemática Discreta
      colour: stringRequired,
      course: stringRequired, // K1021
      shift: stringRequired, // Mañana
      classroom: stringRequired, // S06
      campus: stringRequired, // Medrano
      day: { type: [Number], required: true }, // [ 3 ]
      startHour: { type: [String], required: true }, // [8:30]
      finishHour: { type: [String], required: true }, // [12:30]
      state: { type: String, default: 'Cursando' },
    },
    {
      timestamps: true,
    }
  );

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    (mongooseClient as any).deleteModel(modelName);
  }
  return mongooseClient.model<Course>(modelName, schema);
}
