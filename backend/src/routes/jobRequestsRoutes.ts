// src/routes/employerRoutes.ts
import { Router } from 'express';
import {
  getAllJobRequests,
  createJobRequest,
  getJobRequestById,
  deleteJobRequest,
  updateJobRequest,
  getJobsByEmployerId,
  assignYouthToJobRequest,
  updateJobRequestStatus,
  getAssignedYouthsByJobId,
} from '../controllers/jobRequestController';

const router: Router = Router();

// Routes for employer CRUD operations
router.get('/', getAllJobRequests);          // Get all employers
router.post('/', createJobRequest);          // Create a new employer
router.get('/:id', getJobRequestById);      // Get employer by ID
router.put('/:id', updateJobRequest);       // Update employer by ID
router.delete('/:id', deleteJobRequest);    // Delete employer by ID
router.get('/by-employer/:employerId', getJobsByEmployerId);
router.put('/:id/youths/:youthId', assignYouthToJobRequest);
router.put('/:id/status', updateJobRequestStatus);
router.get('/assigned-youths/:id', getAssignedYouthsByJobId);


export default router;
