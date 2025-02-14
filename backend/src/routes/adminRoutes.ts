import { Router } from 'express';
import { getAllAdmins, createAdmin, getAdminById, deleteAdmin, updateAdminStatus, updateAdmin } from '../controllers/adminController';

const router: Router = Router();

// Get all admins
router.get('/', getAllAdmins); // Use '/' instead of '/admin'
// Create a new admin
router.post('/', createAdmin);
router.get('/:id', getAdminById);
router.put('/:id/status', updateAdminStatus);
router.delete('/:id', deleteAdmin);
router.put('/:id', updateAdmin);

export default router;
