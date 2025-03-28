import { Request, Response } from 'express';
import {Attendance, DayRecord} from '../models/Attendance';
import Payment from '../models/Payments';

const DAILY_RATE = 15; // Change this based on your payment rate

// Generate payment based on attendance
export const generatePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { youthId, jobRequestId } = req.body;

    if (!youthId || !jobRequestId) {
      res
        .status(400)
        .json({ message: 'Missing required fields: youthId, jobRequestId' });
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

    const daysArray =
      typeof attendance.days === 'string'
        ? JSON.parse(attendance.days)
        : attendance.days;

    if (!Array.isArray(daysArray)) {
      res.status(500).json({ message: 'Attendance days data is corrupted' });
      return;
    }

    // Count accepted workdays
    const totalDaysWorked = daysArray.filter(
      (day) => day.accepted && day.adminChecked // Only count admin-verified days
    ).length;
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
    res
      .status(500)
      .json({ message: 'Error generating payment', error: error.message });
  }
};

// Get payment records for a specific youth
export const getPaymentsByYouth = async (
  req: Request,
  res: Response
): Promise<void> => {
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

// In your payment.controller.ts

export const generatePaymentsForMultipleYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthJobPairs } = req.body;

    if (!Array.isArray(youthJobPairs)) {
      res.status(400).json({
        message: 'Expected array of { youthId, jobRequestId } objects'
      });
      return;
    }

    const results = [];
    const errors = [];
    let totalDaysCounted = 0;

    for (const pair of youthJobPairs) {
      try {
        const { youthId, jobRequestId } = pair;

        // Check for existing payment first
        const existingPayment = await Payment.findOne({
          where: { youthId, jobRequestId }
        });

        if (existingPayment) {
          errors.push({
            youthId,
            jobRequestId,
            error: 'Payment already exists'
          });
          continue;
        }

        // Get attendance record
        const attendance = await Attendance.findOne({
          where: { youthId, jobRequestId },
        });

        if (!attendance) {
          errors.push({
            youthId,
            jobRequestId,
            error: 'Attendance record not found'
          });
          continue;
        }

        // Parse days data
        const daysArray = typeof attendance.days === "string"
          ? JSON.parse(attendance.days)
          : attendance.days;

        if (!Array.isArray(daysArray)) {
          errors.push({
            youthId,
            jobRequestId,
            error: 'Invalid attendance days format'
          });
          continue;
        }

        // Filter for admin-checked AND accepted days
        const eligibleDays = daysArray.filter(day =>
          day.accepted && day.adminChecked
        );

        if (eligibleDays.length === 0) {
          errors.push({
            youthId,
            jobRequestId,
            error: 'No admin-verified days found'
          });
          continue;
        }

        // Calculate payment
        const daysWorked = eligibleDays.length;
        const amountPaid = daysWorked * DAILY_RATE;
        totalDaysCounted += daysWorked;

        // Create payment record
        const payment = await Payment.create({
          jobRequestId,
          employerId: attendance.employerId,
          youthId,
          totalDaysWorked: daysWorked,
          amountPaid,
          paymentDate: new Date(),
          verificationStatus: 'admin-verified',
        });

        await attendance.update({ days: daysArray.map(day => {
          if (day.accepted && day.adminChecked) {
            return { ...day, paid: true };
          }
          return day;
        })});

        results.push(payment);
      } catch (error) {
        errors.push({
          youthId: pair.youthId,
          jobRequestId: pair.jobRequestId,
          error: error.message
        });
      }
    }

    res.status(201).json({
      success: results.length > 0,
      successfulPayments: results,
      failedPayments: errors,
      totalAmount: results.reduce((sum, p) => sum + p.amountPaid, 0),
      totalDaysPaid: totalDaysCounted,
      totalYouthsPaid: results.length
    });

  } catch (error) {
    console.error('Payment generation error:', error);
    res.status(500).json({
      message: 'Error generating payments',
      error: error.message
    });
  }
};