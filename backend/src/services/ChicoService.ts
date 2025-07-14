import mongoose from 'mongoose';
import Chico, { IChico } from '../models/Chico';
import Micro from '../models/Micro';
import { CreateChicoDto, UpdateChicoDto } from '../models/dtos/ChicoDto';

export class ChicoService {
  async findAll(): Promise<IChico[]> {
    return await Chico.find().populate('microId', 'patente modelo');
  }

  async findByDni(dni: string): Promise<IChico | null> {
    return await Chico.findOne({ dni }).populate('microId', 'patente modelo');
  }

  async create(chicoData: CreateChicoDto): Promise<IChico> {
    const existingChico = await Chico.findOne({ dni: chicoData.dni });
    if (existingChico) {
      throw new Error('DNI already exists');
    }

    const chico = new Chico(chicoData);
    return await chico.save();
  }

  async update(dni: string, chicoData: UpdateChicoDto): Promise<IChico> {
    const chico = await Chico.findOneAndUpdate(
      { dni },
      chicoData,
      { new: true, runValidators: true }
    ).populate('microId', 'patente modelo');

    if (!chico) {
      throw new Error('Chico not found');
    }

    return chico;
  }

  async delete(dni: string): Promise<void> {
    const chico = await Chico.findOne({ dni });
    if (!chico) {
      throw new Error('Chico not found');
    }

    if (chico.microId) {
      await this.removeFromMicro(dni);
    }

    await Chico.deleteOne({ dni });
  }

  async assignToMicro(dni: string, patente: string): Promise<IChico> {
    const chico = await Chico.findOne({ dni });
    if (!chico) {
      throw new Error('Chico not found');
    }

    if (chico.microId) {
      throw new Error('Chico already assigned to a micro');
    }

    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    const chicosInMicro = await Chico.countDocuments({ microId: micro._id });
    if (chicosInMicro >= micro.capacidad) {
      throw new Error('Micro has reached maximum capacity');
    }

    chico.microId = micro._id as mongoose.Types.ObjectId;
    return await chico.save();
  }

  async removeFromMicro(dni: string): Promise<IChico> {
    const chico = await Chico.findOne({ dni });
    if (!chico) {
      throw new Error('Chico not found');
    }

    if (!chico.microId) {
      throw new Error('Chico is not assigned to any micro');
    }

    chico.microId = null;
    return await chico.save();
  }
}