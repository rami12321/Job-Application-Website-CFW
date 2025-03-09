// src/routes/attendanceRoutes.ts
import { Router } from 'express';
import { getAllAttendances, createAttendance, getAttendanceById, updateAttendance, deleteAttendance } from '../controllers/attendanceController';

const router: Router = Router();

// GET all attendance records
router.get('/', getAllAttendances);

// POST a new attendance record
router.post('/', createAttendance);

// GET a specific attendance record by ID
router.get('/:id', getAttendanceById);

// PUT update an attendance record by ID
router.put('/:id', updateAttendance);

// DELETE an attendance record by ID
router.delete('/:id', deleteAttendance);

export default router;
