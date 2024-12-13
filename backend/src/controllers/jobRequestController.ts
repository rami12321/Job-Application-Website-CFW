// src/controllers/jobRequestController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Youth } from '../models/youth'; // Import Youth model
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

  // Create a new job request object excluding `id` from the client
  const { id, ...jobRequestData } = req.body; // Exclude `id` if it exists in the client's data
  const newJobRequest: Job = {
    ...jobRequestData, // Include all other data from the client
    id: generateUniqueId(), // Generate a new unique ID server-side
  };

  // Push the new job request to the array
  jobRequests.push(newJobRequest);

  // Save the updated job requests array back to the file
  writeFile(jobRequests);

  // Return the newly created job request
  res.status(201).json(newJobRequest);
};

// Function to generate a unique ID (make sure this matches the client-side ID generation logic)
function generateUniqueId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `${randomLetter}-${randomNumber}`;
}


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

export const assignYouthToJob = (req: Request, res: Response): void => {
  const { jobId, youthId } = req.params; // Job ID and Youth ID from request params
  let jobRequests: Job[] = readFile();

  const jobIndex = jobRequests.findIndex((job) => job.id === jobId);
  if (jobIndex === -1) {
    res.status(404).json({ message: `Job with ID ${jobId} not found.` });
    return;
  }

  // Ensure the youth ID isn't already assigned
  if (jobRequests[jobIndex].assignedYouth.includes(youthId)) {
    res.status(400).json({ message: `Youth with ID ${youthId} is already assigned to this job.` });
    return;
  }

  // Add the youth ID to the assignedYouth array
  jobRequests[jobIndex].assignedYouth.push(youthId);

  writeFile(jobRequests);
  res.status(200).json({ message: "Youth assigned successfully.", job: jobRequests[jobIndex] });
};
