import { Request, Response } from 'express';
import Attendance from '../models/Attendance';

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
  
