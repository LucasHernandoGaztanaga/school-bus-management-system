import { Request, Response, NextFunction } from 'express';
import { ChoferService } from '../services/ChoferService';

export class ChoferController {
  private choferService: ChoferService;

  constructor() {
    this.choferService = new ChoferService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const choferes = await this.choferService.findAll();
      res.json({
        success: true,
        data: choferes
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
      
      const chofer = await this.choferService.findByDni(dni);
      if (!chofer) {
        res.status(404).json({
          success: false,
          message: 'Chofer not found'
        });
        return;
      }

      res.json({
        success: true,
        data: chofer
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const chofer = await this.choferService.create(req.body);
      res.status(201).json({
        success: true,
        data: chofer
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
      
      const chofer = await this.choferService.update(dni, req.body);
      res.json({
        success: true,
        data: chofer
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
      
      await this.choferService.delete(dni);
      res.json({
        success: true,
        message: 'Chofer deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };
}