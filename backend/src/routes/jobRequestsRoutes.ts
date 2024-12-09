// src/routes/employerRoutes.ts
import { Router } from 'express';
import {
  getAllJobRequests,
  createJobRequest,
  getJobRequestById,
  deleteJobRequest,
  updateJobRequest,
} from '../controllers/jobRequestController';

const router: Router = Router();

// Routes for employer CRUD operations
router.get('/', getAllJobRequests);          // Get all employers
router.post('/', createJobRequest);          // Create a new employer
router.get('/:id', getJobRequestById);      // Get employer by ID
router.put('/:id', updateJobRequest);       // Update employer by ID
router.delete('/:id', deleteJobRequest);    // Delete employer by ID


export default router;
