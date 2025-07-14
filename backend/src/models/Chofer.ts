import mongoose, { Document, Schema } from 'mongoose';

export interface IChofer extends Document {
  dni: string;
  nombre: string;
  apellido: string;
  licencia: string;
  microId?: mongoose.Types.ObjectId | null;
}

const ChoferSchema: Schema = new Schema({
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
  licencia: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  microId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Micro',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IChofer>('Chofer', ChoferSchema);