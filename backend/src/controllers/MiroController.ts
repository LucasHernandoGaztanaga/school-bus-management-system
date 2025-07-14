import { Request, Response, NextFunction } from 'express';
import { MicroService } from '../services/MicroService';

export class MicroController {
  private microService: MicroService;

  constructor() {
    this.microService = new MicroService();
  }

  findAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const micros = await this.microService.findAll();
      res.json({
        success: true,
        data: micros
      });
    } catch (error) {
      next(error);
    }
  };

  findByPatente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      const micro = await this.microService.findByPatente(patente.toUpperCase());
      if (!micro) {
        res.status(404).json({
          success: false,
          message: 'Micro not found'
        });
        return;
      }

      res.json({
        success: true,
        data: micro
      });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const micro = await this.microService.create(req.body);
      res.status(201).json({
        success: true,
        data: micro
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      const micro = await this.microService.update(patente.toUpperCase(), req.body);
      res.json({
        success: true,
        data: micro
      });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      await this.microService.delete(patente.toUpperCase());
      res.json({
        success: true,
        message: 'Micro deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  assignChofer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      const { choferDni } = req.body;
      const micro = await this.microService.assignChofer(patente.toUpperCase(), choferDni);
      res.json({
        success: true,
        data: micro
      });
    } catch (error) {
      next(error);
    }
  };

  removeChofer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      const micro = await this.microService.removeChofer(patente.toUpperCase());
      res.json({
        success: true,
        data: micro
      });
    } catch (error) {
      next(error);
    }
  };

  getChicos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { patente } = req.params;
      if (!patente) {
        res.status(400).json({
          success: false,
          message: 'Patente parameter is required'
        });
        return;
      }
      
      const chicos = await this.microService.getChicos(patente.toUpperCase());
      res.json({
        success: true,
        data: chicos
      });
    } catch (error) {
      next(error);
    }
  };
}