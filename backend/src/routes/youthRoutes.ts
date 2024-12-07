// src/routes/youthRoutes.ts
import { Router } from 'express';
import { body } from 'express-validator';
import {
  getAllYouth,
  createYouth,
  // updateYouth,
  deleteYouth,
  getYouthById,
  updateYouthStatus,
  checkRegistrationNumber,
  updateYouth,
  updateYouthExperience,
  updateYouthTraining,
} from '../controllers/youthController';

const router = Router();

router.get('/', getAllYouth);

router.get('/:id', getYouthById);

router.post(
  '/',
  [
    body('id').notEmpty().withMessage('ID is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    // Add more validators as needed
  ],
  createYouth
);
router.put('/:id', updateYouth);
// Assuming you're using Express.js
router.put('/:id/experiences', updateYouthExperience); // Route for updating experiences only
router.put('/:id/trainings', updateYouthTraining);

// router.put('/:id', updateYouth);

router.delete('/:id', deleteYouth);

router.patch('/:id/status', updateYouthStatus);
router.post('/check-registration', checkRegistrationNumber);

export default router;  // Correct export
