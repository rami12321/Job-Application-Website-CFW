import { Request, Response } from 'express';
import VerificationCode from '../models/verificationCode';

// Generate a unique verification code
const generateCode = (): string => {
  const min = 100000; // 6-digit number minimum
  const max = 999999; // 6-digit number maximum
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// Generate a new verification code
export const generateVerificationCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const newCode = generateCode();

    // Save the new code to the database
    const verificationCode = await VerificationCode.create({ code: newCode });

    res.status(201).json({ code: verificationCode.code });
  } catch (error) {
    res.status(500).json({ message: 'Error generating verification code', error });
  }
};

// Get all verification codes (optional, for debugging or listing)
export const getAllCodes = async (req: Request, res: Response): Promise<void> => {
  try {
    const codes = await VerificationCode.findAll();
    res.status(200).json(codes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching verification codes', error });
  }
};

// Delete a verification code after it has been used
export const deleteCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.params;

    const verificationCode = await VerificationCode.findOne({ where: { code } });

    if (!verificationCode) {
      res.status(404).json({ message: `Code ${code} not found.` });
      return;
    }

    await verificationCode.destroy();

    res.status(200).json({ message: `Code ${code} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting verification code', error });
  }
};
