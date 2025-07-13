import { Request, Response, NextFunction } from 'express';
import { ChicoService } from '../services/ChicoService';

export class ChicoController {
  private chicoService: ChicoService;

  constructor() {
    this.chicoService = new ChicoService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chicos = await this.chicoService.findAll();
      res.json({
        success: true,
        data: chicos
      });
    } catch (error) {
      next(error);
    }
  };

  findByDni = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dni } = req.params;
      if (!dni) {
        res.status(400).json({
          success: false,
          message: 'DNI parameter is required'
        });
        return;
      }
      
      const chico = await this.chicoService.findByDni(dni);
      if (!chico) {
        res.status(404).json({
          success: false,
          message: 'Chico not found'
        });
        return;
      }

      res.json({
        success: true,
        data: chico
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chico = await this.chicoService.create(req.body);
      res.status(201).json({
        success: true,
        data: chico
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dni } = req.params;
      if (!dni) {
        res.status(400).json({
          success: false,
          message: 'DNI parameter is required'
        });
        return;
      }
      
      const chico = await this.chicoService.update(dni, req.body);
      res.json({
        success: true,
        data: chico
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dni } = req.params;
      if (!dni) {
        res.status(400).json({
          success: false,
          message: 'DNI parameter is required'
        });
        return;
      }
      
      await this.chicoService.delete(dni);
      res.json({
        success: true,
        message: 'Chico deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  assignToMicro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dni } = req.params;
      if (!dni) {
        res.status(400).json({
          success: false,
          message: 'DNI parameter is required'
        });
        return;
      }
      
      const { microPatente } = req.body;
      const chico = await this.chicoService.assignToMicro(dni, microPatente);
      res.json({
        success: true,
        data: chico
      });
    } catch (error) {
      next(error);
    }
  };

  removeFromMicro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { dni } = req.params;
      if (!dni) {
        res.status(400).json({
          success: false,
          message: 'DNI parameter is required'
        });
        return;
      }
      
      const chico = await this.chicoService.removeFromMicro(dni);
      res.json({
        success: true,
        data: chico
      });
    } catch (error) {
      next(error);
    }
  };
}