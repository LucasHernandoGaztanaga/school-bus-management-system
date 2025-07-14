import { Router } from 'express';
import { MicroController } from '../controllers/MiroController';
import { validateMicro, validatePatente } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();
const microController = new MicroController();

router.get('/', microController.findAll);
router.get('/:patente', validatePatente, handleValidationErrors, microController.findByPatente);
router.post('/', validateMicro, handleValidationErrors, microController.create);
router.put('/:patente', validatePatente, handleValidationErrors, microController.update);
router.delete('/:patente', validatePatente, handleValidationErrors, microController.delete);
router.post('/:patente/assign-chofer', validatePatente, handleValidationErrors, microController.assignChofer);
router.delete('/:patente/chofer', validatePatente, handleValidationErrors, microController.removeChofer);
router.get('/:patente/chicos', validatePatente, handleValidationErrors, microController.getChicos);

export default router;