import { Router } from 'express';
import { ChoferController } from '../controllers/ChoferController';
import { validateChofer, validateDni } from '../middleware/validation';
import { handleValidationErrors } from '../middleware/errorHandler';

const router = Router();
const choferController = new ChoferController();

router.get('/', choferController.findAll);
router.get('/:dni', validateDni, handleValidationErrors, choferController.findByDni);
router.post('/', validateChofer, handleValidationErrors, choferController.create);
router.put('/:dni', validateDni, handleValidationErrors, choferController.update);
router.delete('/:dni', validateDni, handleValidationErrors, choferController.delete);

export default router;