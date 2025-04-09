import { Request, Response } from 'express';
import { Attendance } from '../models/Attendance';
import Payment from '../models/Payments';
import sequelize from '../../config/database';

const DAILY_RATE = 15; // Your daily rate
const MAX_BATCH_SIZE = 100; // Maximum payments to process at once

// Helper function to check existing payments
async function checkExistingPayments(youthIds: string[], transaction?: any): Promise<Payment[]> {
  return await Payment.findAll({
    where: { youthId: youthIds },
    ...(transaction && { transaction })
  });
}

export const generatePaymentsForMultipleYouth = async (req: Request, res: Response): Promise<void> => {
  const transaction = await sequelize.transaction();
  try {
    // Accept array directly instead of { youthJobPairs }
    const youthJobPairs = req.body;
    if (youthJobPairs.length > MAX_BATCH_SIZE) {
      await transaction.rollback();
      res.status(400).json({
        success: false,
        message: `Maximum batch size is ${MAX_BATCH_SIZE}`
      });
      return;
    }

    // Check for existing payments
    const existingPayments = await checkExistingPayments(
      youthJobPairs.map(p => p.youthId),
      transaction
    );

    // if (existingPayments.length > 0) {
    //   await transaction.rollback();
    //   res.status(400).json({
    //     success: false,
    //     message: 'Some youths already have payments',
    //     existingYouthIds: existingPayments.map(p => p.youthId)
    //   });
    //   return;
    // }

    const results = [];
    const errors = [];
    let totalDaysCounted = 0;
    let totalAmount = 0;

    // Process each payment
    // Process each payment
for (const pair of youthJobPairs) {
  try {
    const { youthId, jobRequestId } = pair;

    // Get attendance record
    const attendance = await Attendance.findOne({
      where: { youthId, jobRequestId },
      transaction,
      lock: transaction.LOCK.UPDATE
    });

    if (!attendance) {
      errors.push({
        youthId,
        jobRequestId,
        error: 'Attendance record not found',
        code: 'ATTENDANCE_NOT_FOUND'
      });
      continue;
    }

    // Parse and validate days
    const daysArray = typeof attendance.days === "string"
      ? JSON.parse(attendance.days)
      : attendance.days;

    if (!Array.isArray(daysArray)) {
      errors.push({
        youthId,
        jobRequestId,
        error: 'Invalid attendance days format',
        code: 'INVALID_DAYS_FORMAT'
      });
      continue;
    }

    // Get eligible days with their indices
    const eligibleDays = daysArray
      .map((day, index) => ({ ...day, index }))
      .filter(day => day.accepted && day.adminChecked && !day.paid);

    // Check if youth has already reached 40 workdays
    const alreadyPaidDays = daysArray.filter(day => day.paid).length;
    if (alreadyPaidDays >= 40) {
      errors.push({
        youthId,
        jobRequestId,
        error: 'Youth has already reached 40 paid workdays',
        code: 'MAX_DAYS_REACHED'
      });
      continue;
    }

    // Calculate remaining days allowed
    const remainingDaysAllowed = 40 - alreadyPaidDays;
    const daysToPay = eligibleDays.slice(0, remainingDaysAllowed);

    if (daysToPay.length === 0) {
      errors.push({
        youthId,
        jobRequestId,
        error: 'No eligible days found',
        code: 'NO_ELIGIBLE_DAYS',
        totalDays: daysArray.length,
        eligibleDaysCount: eligibleDays.length,
        alreadyPaidDays
      });
      continue;
    }

    // Calculate payment
    const daysWorked = daysToPay.length;
    const amountPaid = daysWorked * DAILY_RATE;
    totalDaysCounted += daysWorked;
    totalAmount += amountPaid;

    // Create payment record
    const payment = await Payment.create({
      jobRequestId,
      employerId: attendance.employerId,
      youthId,
      totalDaysWorked: daysWorked,
      amountPaid,
      paymentDate: new Date(),
      verificationStatus: 'admin-verified',
      paidDaysIndices: daysToPay.map(d => d.index)
    }, { transaction });

    // Mark days as paid in the attendance record
    const updatedDays = daysArray.map((day, index) =>
      daysToPay.some(d => d.index === index) ? { ...day, paid: true } : day
    );

    await attendance.update({ days: updatedDays }, { transaction });

    results.push({
      paymentId: payment.id,
      youthId,
      jobRequestId,
      daysPaid: daysWorked,
      amountPaid,
      paidDaysIndices: daysToPay.map(d => d.index)
    });

  } catch (error) {
    errors.push({
      youthId: pair.youthId,
      jobRequestId: pair.jobRequestId,
      error: error instanceof Error ? error.message : 'Unknown error',
      code: 'PROCESSING_ERROR'
    });
  }
}

    // Finalize transaction
    if (results.length === 0) {
      await transaction.rollback();
      res.status(400).json({
        success: false,
        message: 'No payments were processed',
        failedPayments: errors
      });
      return;
    }

    await transaction.commit();
    res.status(201).json({
      success: true,
      successfulPayments: results,
      failedPayments: errors,
      totalAmount,
      totalDaysPaid: totalDaysCounted,
      totalYouthsPaid: results.length
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Payment generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during payment generation',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get payments for multiple youth
export const getPaymentsByYouthIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthIds } = req.query;

    if (!youthIds) {
      res.status(400).json({ message: 'youthIds parameter is required' });
      return;
    }

    const ids = (youthIds as string).split(',');
    const payments = await checkExistingPayments(ids);

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payments',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Generate single payment
export const generatePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId, jobRequestId } = req.body;

    if (!youthId || !jobRequestId) {
      res.status(400).json({ message: 'Missing required fields: youthId, jobRequestId' });
      return;
    }

    // Check for existing payment first
    const existingPayment = await Payment.findOne({
      where: { youthId, jobRequestId }
    });

    if (existingPayment) {
      res.status(400).json({
        message: 'Payment already exists for this youth and job request'
      });
      return;
    }

    // Find attendance record
    const attendance = await Attendance.findOne({
      where: { youthId, jobRequestId }
    });

    if (!attendance) {
      res.status(404).json({ message: 'Attendance record not found' });
      return;
    }

    const daysArray = typeof attendance.days === 'string'
      ? JSON.parse(attendance.days)
      : attendance.days;

    if (!Array.isArray(daysArray)) {
      res.status(500).json({ message: 'Attendance days data is corrupted' });
      return;
    }

    // Count eligible days
    const totalDaysWorked = daysArray.filter(
      day => day.accepted && day.adminChecked
    ).length;
    const amountPaid = totalDaysWorked * DAILY_RATE;

    // Create payment
    const payment = await Payment.create({
      jobRequestId,
      employerId: attendance.employerId,
      youthId,
      totalDaysWorked,
      amountPaid,
      paymentDate: new Date(),
      verificationStatus: 'admin-verified'
    });

    res.status(201).json(payment);
  } catch (error) {
    console.error('Error generating payment:', error);
    res.status(500).json({
      message: 'Error generating payment',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get payment records for a specific youth
export const getPaymentsByYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId } = req.params;
    const payments = await Payment.findAll({
      where: { youthId }
    });
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payment records',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { youthId, employerId, jobRequestId, page = 1, limit = 10 } = req.query;

    const filters: any = {};
    if (youthId) filters.youthId = youthId;
    if (employerId) filters.employerId = employerId;
    if (jobRequestId) filters.jobRequestId = jobRequestId;

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows } = await Payment.findAndCountAll({
      where: filters,
      limit: Number(limit),
      offset,
      order: [['paymentDate', 'DESC']]
    });

    res.status(200).json({
      success: true,
      payments: rows,
      totalRecords: count,
      currentPage: Number(page),
      totalPages: Math.ceil(count / Number(limit))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching payment history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
