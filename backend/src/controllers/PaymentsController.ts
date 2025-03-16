import { Request, Response } from 'express';
import Attendance from '../models/Attendance';
import Payment from '../models/Payments';

const DAILY_RATE = 15; // Change this based on your payment rate

// Generate payment based on attendance
export const generatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId, jobRequestId } = req.body;

    if (!youthId || !jobRequestId) {
      res.status(400).json({ message: 'Missing required fields: youthId, jobRequestId' });
      return;
    }

    // Find attendance record
    const attendance = await Attendance.findOne({
      where: { youthId, jobRequestId },
    });

    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    // 🔥 Ensure days is an array
    const daysArray = typeof attendance.days === "string" ? JSON.parse(attendance.days) : attendance.days;

    if (!Array.isArray(daysArray)) {
      res.status(500).json({ message: 'Attendance days data is corrupted' });
      return;
    }

    // Count accepted workdays
    const totalDaysWorked = daysArray.filter((day) => day.accepted).length;
    const amountPaid = totalDaysWorked * DAILY_RATE; // Example rate

    // Save payment
    const payment = await Payment.create({
      jobRequestId,
      employerId: attendance.employerId,
      youthId,
      totalDaysWorked,
      amountPaid,
      paymentDate: new Date(),
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error generating payment:', error);
    res.status(500).json({ message: 'Error generating payment', error: error.message });
  }
};



// Get payment records for a specific youth
export const getPaymentsByYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId } = req.params;

    const payments = await Payment.findAll({
      where: { youthId },
    });

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payment records', error });
  }
};
