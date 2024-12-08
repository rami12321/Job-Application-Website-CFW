// src/controllers/jobRequestController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Job } from '../models/jobRequest';
const filePath = path.join(__dirname, '../../../public/assets/data/jobRequests.json');

const readFile = (): Job[] => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeFile = (data: Job[]): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Data written successfully.');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};

// Get all jobRequests
export const getAllJobRequests = (req: Request, res: Response): void => {
  const jobRequests: Job[] = readFile();
  res.status(200).json(jobRequests);
};

//Create New jobRequest
export const createJobRequest = (req: Request, res: Response): void => {
  const jobRequests: Job[] = readFile();
  const newJobRequest: Job = req.body; // Ensure req.body adheres to jobRequest type

  // Generate the ID and assign it to the new jobRequest

  jobRequests.push(newJobRequest);
  writeFile(jobRequests);

  res.status(201).json(newJobRequest);
};

export const getJobRequestById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const jobRequests: Job[] = readFile();
  const jobRequest = jobRequests.find((e) => e.id === id);

  if (!jobRequest) {
    res.status(404).json({ message: `jobRequest with ID ${id} not found.` });
    return;
  }

  res.status(200).json(jobRequest);
};

export const updateJobRequest = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData: Partial<Job> = req.body; // Accept partial updates
  let jobRequests: Job[] = readFile();
  const jobRequestIndex = jobRequests.findIndex((e) => e.id === id);

  if (jobRequestIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  // Merge the existing employer data with updated data
  const updatedJobRequest = { ...jobRequests[jobRequestIndex], ...updatedData };
  jobRequests[jobRequestIndex] = updatedJobRequest;

  writeFile(jobRequests);

  res.status(200).json({ message: `Employer with ID ${id} updated successfully.`, updatedJobRequest });
};

export const deleteJobRequest = (req: Request, res: Response): void => {
  const { id } = req.params;
  let jobRequests: Job[] = readFile();
  const jobRequestIndex = jobRequests.findIndex((e) => e.id === id);

  if (jobRequestIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }

  const deletedJobRequest = jobRequests.splice(jobRequestIndex, 1); // Remove employer
  writeFile(jobRequests);

  res.status(200).json({ message: `Job Request with ID ${id} deleted successfully.`, deletedJobRequest });
};
