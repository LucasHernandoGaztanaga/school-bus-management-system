import mongoose, { Document, Schema } from 'mongoose';

export interface IChico extends Document {
  dni: string;
  nombre: string;
  apellido: string;
  edad: number;
  microId?: mongoose.Types.ObjectId | null;
}

const ChicoSchema: Schema = new Schema({
  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  apellido: {
    type: String,
    required: true,
    trim: true
  },
  edad: {
    type: Number,
    required: true,
    min: 3,
    max: 18
  },
  microId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Micro',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IChico>('Chico', ChicoSchema);