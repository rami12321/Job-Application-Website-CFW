// src/controllers/employerController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Employer } from '../../../public/Model/Employer';

const filePath = path.join(__dirname, '../../../public/assets/data/employers.json');

// Utility functions
const readFile = (): Employer[] => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeFile = (data: Employer[]): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};
const generateId = (): string => {
  const min = 10000000;  // Minimum 8-digit number
  const max = 99999999;  // Maximum 8-digit number
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// Get all employers
export const getAllEmployers = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  res.status(200).json(employers);
};

//Create New Employer
export const createEmployer = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  const newEmployer: Employer = req.body; // Ensure req.body adheres to Employer type

  // Generate the ID and assign it to the new employer
  newEmployer.id = generateId();

  employers.push(newEmployer);
  writeFile(employers);

  res.status(201).json(newEmployer);
};

// Get employer by ID
export const getEmployerById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const employers: Employer[] = readFile();
  const employer = employers.find((e) => e.id === id);

  if (!employer) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  res.status(200).json(employer);
};

// Delete employer by ID
export const deleteEmployer = (req: Request, res: Response): void => {
  const { id } = req.params;
  let employers: Employer[] = readFile();
  const employerIndex = employers.findIndex((e) => e.id === id);

  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  const deletedEmployer = employers.splice(employerIndex, 1); // Remove employer
  writeFile(employers);

  res.status(200).json({ message: `Employer with ID ${id} deleted successfully.`, deletedEmployer });
};

// Update employer by ID
export const updateEmployer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData: Partial<Employer> = req.body; // Accept partial updates
  let employers: Employer[] = readFile();
  const employerIndex = employers.findIndex((e) => e.id === id);

  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  // Merge the existing employer data with updated data
  const updatedEmployer = { ...employers[employerIndex], ...updatedData };
  employers[employerIndex] = updatedEmployer;

  writeFile(employers);

  res.status(200).json({ message: `Employer with ID ${id} updated successfully.`, updatedEmployer });
};
