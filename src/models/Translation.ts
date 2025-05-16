import mongoose, { Schema, Document } from 'mongoose';

interface ITranslation extends Document {
  originalText: string;
  laguage: string;
  count: number;
  translations: Map<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const TranslationSchema: Schema = new Schema(
  {
    originalText: {
      type: String,
      required: true,
      unique: true,
    },
    language: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      default: 1,
    },
    translations: {
      type: Map,
      of: String,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

const Translation = mongoose.model<ITranslation>(
  'Translation',
  TranslationSchema
);

export default Translation;
