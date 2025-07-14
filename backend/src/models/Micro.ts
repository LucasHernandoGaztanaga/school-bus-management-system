import mongoose, { Document, Schema } from 'mongoose';

export interface IMicro extends Document {
  patente: string;
  modelo: string;
  capacidad: number;
  choferId?: mongoose.Types.ObjectId | null;
}

const MicroSchema: Schema = new Schema({
  patente: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  modelo: {
    type: String,
    required: true,
    trim: true
  },
  capacidad: {
    type: Number,
    required: true,
    min: 10,
    max: 50
  },
  choferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chofer',
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model<IMicro>('Micro', MicroSchema);