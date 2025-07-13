import mongoose from 'mongoose';
import Micro, { IMicro } from '../models/Micro';
import Chico from '../models/Chico';
import Chofer from '../models/Chofer';
import { CreateMicroDto, UpdateMicroDto } from '../models/dtos/MicroDto';

export class MicroService {
  async findAll(): Promise<IMicro[]> {
    return await Micro.find().populate('choferId', 'dni nombre apellido');
  }

  async findByPatente(patente: string): Promise<IMicro | null> {
    return await Micro.findOne({ patente }).populate('choferId', 'dni nombre apellido');
  }

  async create(microData: CreateMicroDto): Promise<IMicro> {
    const existingMicro = await Micro.findOne({ patente: microData.patente });
    if (existingMicro) {
      throw new Error('Patente already exists');
    }

    const micro = new Micro(microData);
    return await micro.save();
  }

  async update(patente: string, microData: UpdateMicroDto): Promise<IMicro> {
    const micro = await Micro.findOneAndUpdate(
      { patente },
      microData,
      { new: true, runValidators: true }
    ).populate('choferId', 'dni nombre apellido');

    if (!micro) {
      throw new Error('Micro not found');
    }

    if (microData.capacidad) {
      const chicosCount = await Chico.countDocuments({ microId: micro._id });
      if (chicosCount > microData.capacidad) {
        throw new Error('Cannot reduce capacity below current student count');
      }
    }

    return micro;
  }

  async delete(patente: string): Promise<void> {
    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    const chicosCount = await Chico.countDocuments({ microId: micro._id });
    if (chicosCount > 0) {
      throw new Error('Cannot delete micro with assigned students');
    }

    if (micro.choferId) {
      await Chofer.findByIdAndUpdate(micro.choferId, { microId: null });
    }

    await Micro.deleteOne({ patente });
  }

  async assignChofer(patente: string, choferDni: string): Promise<IMicro> {
    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    if (micro.choferId) {
      throw new Error('Micro already has a chofer assigned');
    }

    const chofer = await Chofer.findOne({ dni: choferDni });
    if (!chofer) {
      throw new Error('Chofer not found');
    }

    if (chofer.microId) {
      throw new Error('Chofer already assigned to another micro');
    }

    micro.choferId = chofer._id as mongoose.Types.ObjectId;
    chofer.microId = micro._id as mongoose.Types.ObjectId;

    await chofer.save();
    return await micro.save();
  }

  async removeChofer(patente: string): Promise<IMicro> {
    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    if (!micro.choferId) {
      throw new Error('Micro does not have a chofer assigned');
    }

    await Chofer.findByIdAndUpdate(micro.choferId, { microId: null });
    micro.choferId = null;

    return await micro.save();
  }

  async getChicos(patente: string) {
    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    return await Chico.find({ microId: micro._id });
  }
}