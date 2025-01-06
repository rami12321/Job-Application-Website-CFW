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
  updateYouthNotes,
  getYouthNotesById,
  updateYouthCamp,
  getAppliedJobById,
  getYouthByJob,
  updateAppliedJob,
  updateJob,
  updateYouthIsEdited,
  getYouthIsEditedStatusById,

} from '../controllers/youthController';
// import { assignYouthToJob } from '../controllers/jobRequestController';

const router = Router();

router.get('/', getAllYouth);

router.get('/:id', getYouthById);
router.patch('/:id/camp', updateYouthCamp);

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
router.patch('/:id/notes', updateYouthNotes);
router.get('/:id/notes', getYouthNotesById);
router.get('/:id/appliedJob', getAppliedJobById);
router.get('/appliedJob/:appliedJob', getYouthByJob);
router.patch('/:id/status', updateYouthStatus);
// Add this route to update the appliedJob for a specific youth
router.put('/:id/jobCategory', updateJob);

// router.post('/jobs/:jobId/:youthId', assignYouthToJob);
router.post('/check-registration', checkRegistrationNumber);
router.patch('/:id/isEdited', updateYouthIsEdited);
router.get('/:id/isEdited', getYouthIsEditedStatusById);

export default router;
