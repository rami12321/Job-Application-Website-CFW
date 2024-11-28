// src/controllers/youthController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Youth } from '../../../public/Model/Youth';

const filePath = path.join(__dirname, '../../../public/assets/data/youthdb.json');

// Utility functions remain unchanged
const readFile = (): Youth[] => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeFile = (data: Youth[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Controller functions, e.g., `getAllYouth`, `createYouth`, etc., use the `Youth` type
export const getAllYouth = (req: Request, res: Response): void => {
  const youths: Youth[] = readFile();
  res.status(200).json(youths);
};

// Function to generate an 8-digit ID
const generateId = (): string => {
  const min = 10000000;  // Minimum 8-digit number
  const max = 99999999;  // Maximum 8-digit number
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

export const createYouth = (req: Request, res: Response): void => {
  const youths: Youth[] = readFile();
  const newYouth: Youth = req.body;

  // Generate the ID and assign it to the new youth
  newYouth.id = generateId(); // Ensure req.body adheres to Youth type and includes id field

  youths.push(newYouth);
  writeFile(youths);
  res.status(201).json(newYouth);
};


export const getYouthById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const youths: Youth[] = readFile();
  const youth = youths.find((y) => y.id === id);

  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  res.status(200).json(youth);
};

// Delete youth by ID
export const deleteYouth = (req: Request, res: Response): void => {
  const { id } = req.params;
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  const deletedYouth = youths.splice(youthIndex, 1); // Remove the youth from the array
  writeFile(youths);

  res.status(200).json({ message: `Youth with ID ${id} deleted successfully.`, deletedYouth });
};

// Update youth by ID
export const updateYouth = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData: Partial<Youth> = req.body; // Accept partial updates
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Merge the existing youth data with the updated data
  const updatedYouth = { ...youths[youthIndex], ...updatedData };
  youths[youthIndex] = updatedYouth;

  writeFile(youths);

  res.status(200).json({ message: `Youth with ID ${id} updated successfully.`, updatedYouth });
};
