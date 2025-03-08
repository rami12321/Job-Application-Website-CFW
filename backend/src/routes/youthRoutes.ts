import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
const { body } = require("express-validator");
import {
  getAllYouth,
  createYouth,
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
  updateYouthIsEdited,
  getYouthIsEditedStatusById,
  getYouthDocument // ✅ Add a new controller function to retrieve the CV
} from '../controllers/youthController';

// ✅ Ensure the 'uploads' folder exists
const uploadPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Replace spaces with underscores to avoid issues in URLs
    const safeFileName = file.originalname.replace(/\s+/g, '_');
    console.log("Original:", file.originalname, "Safe:", safeFileName);
    cb(null, Date.now() + '-' + safeFileName);
  }
});
const upload = multer({ storage });

const router = Router();

// ✅ Routes
router.get('/', getAllYouth);
router.get('/:id', getYouthById);
router.patch('/:id/camp', updateYouthCamp);

// ✅ File Upload Handling for Youth CV
router.post(
  '/',
  upload.fields([
    { name: 'cv', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'identityCard', maxCount: 1 },
    { name: 'registrationCard', maxCount: 1 },
    { name: 'degree', maxCount: 1 },
    { name: 'prcsProof', maxCount: 1 },
    { name: 'fireProof', maxCount: 1 },
    { name: 'alShifaaProof', maxCount: 1 }
  ]),
  
  [
    body('id').notEmpty().withMessage('ID is required'),
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
    body('email').isEmail().withMessage('Valid email is required'),
  ],
  createYouth
);

router.put('/:id', updateYouth);
router.put('/:id/experiences', updateYouthExperience);
router.put('/:id/trainings', updateYouthTraining);
router.delete('/:id', deleteYouth);
router.patch('/:id/notes', updateYouthNotes);
router.get('/:id/notes', getYouthNotesById);
router.get('/:id/appliedJob', getAppliedJobById);
router.get('/appliedJob/:appliedJob', getYouthByJob);
router.patch('/:id/status', updateYouthStatus);
router.post('/check-registration', checkRegistrationNumber);
router.patch('/:id/isEdited', updateYouthIsEdited);
router.get('/:id/isEdited', getYouthIsEditedStatusById);

// ✅ New Route: Serve the Youth's CV File
// Add to youthRoutes.ts
router.get('/:id/documents/:docType', getYouthDocument);

export default router;
