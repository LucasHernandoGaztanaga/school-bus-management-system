import { Router } from 'express';
import { ChicoController } from '../controllers/ChicoController';
import { validateChico, validateDni } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();
const chicoController = new ChicoController();

router.get('/', chicoController.findAll);
router.get('/:dni', validateDni, handleValidationErrors, chicoController.findByDni);
router.post('/', validateChico, handleValidationErrors, chicoController.create);
router.put('/:dni', validateDni, handleValidationErrors, chicoController.update);
router.delete('/:dni', validateDni, handleValidationErrors, chicoController.delete);
router.post('/:dni/assign-micro', validateDni, handleValidationErrors, chicoController.assignToMicro);
router.delete('/:dni/micro', validateDni, handleValidationErrors, chicoController.removeFromMicro);

export default router;