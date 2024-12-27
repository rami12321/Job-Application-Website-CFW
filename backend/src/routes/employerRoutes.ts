// src/routes/employerRoutes.ts
import { Router } from 'express';
import {
  getAllEmployers,
  createEmployer,
  getEmployerById,
  deleteEmployer,
  updateEmployer,
  uploadProfileImage,
  assignYouthToEmployer,
  updateActiveStatus,
  getOrganizationNameById,
} from '../controllers/employerController';

const router: Router = Router();

// Routes for employer CRUD operations
router.get('/employer', getAllEmployers);          // Get all employers
router.post('/employer', createEmployer);          // Create a new employer
router.get('/employer/:id', getEmployerById);      // Get employer by ID
router.put('/employer/:id', updateEmployer);       // Update employer by ID
router.delete('/employer/:id', deleteEmployer);    // Delete employer by ID
router.post('/employer/:id/upload-profile-image', uploadProfileImage);  // Upload profile image
router.post('/employer/:id/assign/:youthId', assignYouthToEmployer);
router.put('/employer/:id/updateStatus', updateActiveStatus);
router.get('/employer/:id/organizationName', getOrganizationNameById);


export default router;
