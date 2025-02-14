import { Router } from 'express';
import {
  generateVerificationCode,
  getAllCodes,
  deleteCode

} from '../controllers/VerificationCodeController';

const router: Router = Router();

// Route to generate a new verification code (admin functionality)
// Route to generate a new verification code
router.post('/verificationCode', generateVerificationCode);

// Route to delete a verification code by its value
router.delete('/verificationCode/:code', deleteCode);
// Route to fetch all verification codes (optional, for admin usage)
// In your backend router definition
router.get('/verificationCodes', getAllCodes); // Make sure this route is defined properly



// Endpoint to delete a verification code

export default router;
