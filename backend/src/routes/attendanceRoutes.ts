import { Router } from 'express';
import {
  getAllAttendances,
  createAttendance,
  getAttendanceById,
  updateAttendance,
  deleteAttendance,
  getAttendanceByYouthAndJob,
  verifyAttendanceDays,
  hasAdminVerifiedAttendance,
} from '../controllers/attendanceController';

const router: Router = Router();

// GET all attendance records
router.get('/', getAllAttendances);

// POST a new attendance record
router.post('/', createAttendance);
router.put('/:id/verify-days', verifyAttendanceDays);

// NEW: GET an attendance record by youthId and jobRequestId
// Use query parameters: /attendance/byYouthAndJob?youthId=...&jobRequestId=...
router.get('/byYouthAndJob', getAttendanceByYouthAndJob);

// GET a specific attendance record by ID
router.get('/:id', getAttendanceById);

// PUT update an attendance record by ID
router.put('/:id', updateAttendance);

// DELETE an attendance record by ID
router.delete('/:id', deleteAttendance);

router.get('/verified/:youthId/:jobRequestId', hasAdminVerifiedAttendance);

export default router;
