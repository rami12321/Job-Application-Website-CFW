import express from 'express';
import { generatePayment, generatePaymentsForMultipleYouth, getPaymentsByYouth, getPaymentsByYouthIds } from '../controllers/PaymentsController';

const router = express.Router();

// Route to generate payment based on attendance
router.post('/generate-payment', generatePayment);

router.post('/generate-multiple', generatePaymentsForMultipleYouth);


// Route to get payments for a specific youth
router.get('/payments/:youthId', getPaymentsByYouth);
router.get('/payments/by-youths', getPaymentsByYouthIds);


export default router;
