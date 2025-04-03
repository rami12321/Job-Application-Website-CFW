import { Request, Response } from 'express';
import {Attendance, DayRecord} from '../models/Attendance';

// Get all attendance records
export const getAllAttendances = async (req: Request, res: Response): Promise<void> => {
  try {
    const attendances = await Attendance.findAll();
    res.status(200).json(attendances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error });
  }
};

// Create a new attendance record (40-day archive)
export const createAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobRequestId, employerId, youthId, days } = req.body;
    if (!jobRequestId || !employerId || !youthId) {
      res.status(400).json({ message: 'Missing required fields: jobRequestId, employerId, youthId' });
      return;
    }

    // Use provided days if available; otherwise, create an array of 40 empty day objects.
    const attendanceDays = days || Array.from({ length: 40 }, () => ({
      day: "",
      date: null,
      youthName: "",
      signature: "",
      locationChecked: false,
      confirmed: false,
      accepted: false,
    }));

    const newAttendance = await Attendance.create({
      jobRequestId,
      employerId,
      youthId,
      days: attendanceDays,
    });

    res.status(201).json(newAttendance);
  } catch (error) {
    console.error('Error creating attendance record:', error);
    res.status(500).json({ message: 'Error creating attendance record', error });
  }
};

// Get an attendance record by its ID
export const getAttendanceById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      res.status(404).json({ message: `Attendance record with ID ${id} not found.` });
      return;
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance record', error });
  }
};

// Update an attendance record (this can update the entire JSON array)
export const updateAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      res.status(404).json({ message: `Attendance record with ID ${id} not found.` });
      return;
    }
    await attendance.update(updatedData);
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance record', error });
  }
};

// Delete an attendance record
export const deleteAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      res.status(404).json({ message: `Attendance record with ID ${id} not found.` });
      return;
    }
    await attendance.destroy();
    res.status(200).json({ message: `Attendance record with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting attendance record', error });
  }
};
// NEW: Get an attendance record by youthId and jobRequestId (via query parameters)
export const getAttendanceByYouthAndJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId, jobRequestId } = req.query;
    if (!youthId || !jobRequestId) {
      res.status(400).json({ message: 'Missing required query parameters: youthId and jobRequestId' });
      return;
    }

    // Ensure we extract a string in case the query parameters are arrays
    const youthIdStr = Array.isArray(youthId) ? youthId[0] : youthId;
    const jobRequestIdStr = Array.isArray(jobRequestId) ? jobRequestId[0] : jobRequestId;

    const attendance = await Attendance.findOne({
      where: {
        youthId: youthIdStr,
        jobRequestId: jobRequestIdStr,
      },
    });

    if (!attendance) {
      res.status(404).json({ message: `Attendance record not found for youthId ${youthIdStr} and jobRequestId ${jobRequestIdStr}.` });
      return;
    }
    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance record by youth and job', error });
  }
};

// Verify attendance days (admin endpoint)
// attendance.controller.ts

// Add this new endpoint
export const verifyAttendanceDays = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params; // Get ID from URL params
    const { dayIndices } = req.body;

    const attendance = await Attendance.findByPk(id);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    // Parse days if it's a string
    const days = typeof attendance.days === 'string'
      ? JSON.parse(attendance.days)
      : attendance.days;

    // Verify each requested day
    dayIndices.forEach(index => {
      if (index >= 0 && index < days.length && days[index].employerConfirmed) {
        days[index].adminChecked = true;
      }
    });

    await attendance.update({ days });
    res.status(200).json(attendance);
  } catch (error) {
    console.error('Error verifying days:', error);
    res.status(500).json({ message: 'Error verifying days', error });
  }
};
// Get days eligible for admin verification
export const getVerifiableDays = async (req: Request, res: Response): Promise<void> => {
  try {
    const { attendanceId } = req.params;

    const attendance = await Attendance.findByPk(attendanceId);
    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    const daysArray = typeof attendance.days === 'string'
      ? JSON.parse(attendance.days)
      : attendance.days;

    const verifiableDays = daysArray
      .map((day: DayRecord, index: number) => ({
        index,
        ...day,
        verifiable: day.employerConfirmed && !day.adminChecked
      }))
      .filter((day: any) => day.verifiable);

    res.status(200).json({
      totalDays: daysArray.length,
      verifiableDays,
      count: verifiableDays.length
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error fetching verifiable days',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};

// Check if a youth has admin-verified attendance days for a job request
export const hasAdminVerifiedAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId, jobRequestId } = req.params;

    if (!youthId || !jobRequestId) {
      res.status(400).json({
        message: 'Missing required parameters: youthId and jobRequestId'
      });
      return;
    }

    // Find the attendance record
    const attendance = await Attendance.findOne({
      where: {
        youthId,
        jobRequestId
      }
    });

    if (!attendance) {
      res.status(200).json({
        hasVerifiedAttendance: false,
        message: 'No attendance record found'
      });
      return;
    }

    // Parse days if it's a string
    const days = typeof attendance.days === 'string'
      ? JSON.parse(attendance.days)
      : attendance.days;

    // Check if there are any admin-verified days
    const hasVerifiedDays = days.some((day: DayRecord) => day.adminChecked);

    res.status(200).json({
      hasVerifiedAttendance: hasVerifiedDays,
      verifiedDaysCount: hasVerifiedDays
        ? days.filter((day: DayRecord) => day.adminChecked).length
        : 0,
      totalDays: days.length
    });

  } catch (error) {
    console.error('Error checking verified attendance:', error);
    res.status(500).json({
      message: 'Error checking verified attendance',
      error: error instanceof Error ? error.message : String(error)
    });
  }
};
