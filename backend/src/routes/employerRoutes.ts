// src/routes/employerRoutes.ts
import { Router } from 'express';
import {
  getAllEmployers,
  createEmployer,
  getEmployerById,
  deleteEmployer,
  updateEmployer,
} from '../controllers/employerController';

const router: Router = Router();

// Routes for employer CRUD operations
router.get('/', getAllEmployers);          // Get all employers
router.post('/', createEmployer);          // Create a new employer
router.get('/:id', getEmployerById);      // Get employer by ID
router.put('/:id', updateEmployer);       // Update employer by ID
router.delete('/:id', deleteEmployer);    // Delete employer by ID

export default router;
