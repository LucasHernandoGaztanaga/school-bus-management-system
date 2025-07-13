import Chofer, { IChofer } from '../models/Chofer';
import Micro from '../models/Micro';
import { CreateChoferDto, UpdateChoferDto } from '../models/dtos/ChoferDto';

export class ChoferService {
  async findAll(): Promise<IChofer[]> {
    return await Chofer.find().populate('microId', 'patente modelo');
  }

  async findByDni(dni: string): Promise<IChofer | null> {
    return await Chofer.findOne({ dni }).populate('microId', 'patente modelo');
  }

  async create(choferData: CreateChoferDto): Promise<IChofer> {
    const existingChofer = await Chofer.findOne({ dni: choferData.dni });
    if (existingChofer) {
      throw new Error('DNI already exists');
    }

    const chofer = new Chofer(choferData);
    return await chofer.save();
  }

  async update(dni: string, choferData: UpdateChoferDto): Promise<IChofer> {
    const chofer = await Chofer.findOneAndUpdate(
      { dni },
      choferData,
      { new: true, runValidators: true }
    ).populate('microId', 'patente modelo');

    if (!chofer) {
      throw new Error('Chofer not found');
    }

    return chofer;
  }

  async delete(dni: string): Promise<void> {
    const chofer = await Chofer.findOne({ dni });
    if (!chofer) {
      throw new Error('Chofer not found');
    }

    if (chofer.microId) {
      await Micro.findByIdAndUpdate(chofer.microId, { choferId: undefined });
    }

    await Chofer.deleteOne({ dni });
  }

  async assignToMicro(dni: string, patente: string): Promise<IChofer> {
    const chofer = await Chofer.findOne({ dni });
    if (!chofer) {
      throw new Error('Chofer not found');
    }

    if (chofer.microId) {
      throw new Error('Chofer already assigned to a micro');
    }

    const micro = await Micro.findOne({ patente });
    if (!micro) {
      throw new Error('Micro not found');
    }

    if (micro.choferId) {
      throw new Error('Micro already has a chofer assigned');
    }

    chofer.microId = micro._id;
    micro.choferId = chofer._id;

    await micro.save();
    return await chofer.save();
  }

  async removeFromMicro(dni: string): Promise<IChofer> {
    const chofer = await Chofer.findOne({ dni });
    if (!chofer) {
      throw new Error('Chofer not found');
    }

    if (!chofer.microId) {
      throw new Error('Chofer is not assigned to any micro');
    }

    await Micro.findByIdAndUpdate(chofer.microId, { choferId: undefined });
    chofer.microId = undefined;

    return await chofer.save();
  }
}