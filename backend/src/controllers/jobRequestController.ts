
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Youth } from '../models/youth';
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

export const getAllJobRequests = (req: Request, res: Response): void => {
  const jobRequests: Job[] = readFile();
  res.status(200).json(jobRequests);
};

export const getJobsByEmployerId = (req: Request, res: Response): void => {
  const { employerId } = req.params; // Extract employerId from route parameters

  if (!employerId) {
    res.status(400).json({ message: 'Employer ID is required' });
    return;
  }

  const jobRequests: Job[] = readFile();
  const filteredJobs = jobRequests.filter((job) => job.employerId === employerId);

  if (filteredJobs.length === 0) {
    res.status(404).json({ message: `No jobs found for employer with ID ${employerId}` });
    return;
  }

  res.status(200).json(filteredJobs);
};




export const createJobRequest = (req: Request, res: Response): void => {
  const jobRequests: Job[] = readFile();


  const { id, ...jobRequestData } = req.body;
  const newJobRequest: Job = {
    ...jobRequestData,
    id: generateUniqueId(),
  };


  jobRequests.push(newJobRequest);


  writeFile(jobRequests);


  res.status(201).json(newJobRequest);
};


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
  const updatedData: Partial<Job> = req.body;
  let jobRequests: Job[] = readFile();
  const jobRequestIndex = jobRequests.findIndex((e) => e.id === id);

  if (jobRequestIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }


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

  const deletedJobRequest = jobRequests.splice(jobRequestIndex, 1);
  writeFile(jobRequests);

  res.status(200).json({ message: `Job Request with ID ${id} deleted successfully.`, deletedJobRequest });
};

// Assign youth to a job request
export const assignYouthToJobRequest = (req: Request, res: Response): void => {
  const { id, youthId } = req.params; // Extract jobRequest ID and youthId from route parameters
  const { name } = req.body; // Extract the youth's details from the request body
  const jobRequests: Job[] = readFile(); // Read the current job requests data

  const jobIndex = jobRequests.findIndex((job) => job.id === id);

  // Check if the job request exists
  if (jobIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }

  // Initialize the assigned youths array if it doesn't exist
  if (!jobRequests[jobIndex].assignedYouths) {
    jobRequests[jobIndex].assignedYouths = [];
  }

  // Check if the youth is already assigned
  const existingYouthIndex = jobRequests[jobIndex].assignedYouths.findIndex((y) => y.id === youthId);

  if (existingYouthIndex !== -1) {
    // If the youth is already assigned, update their details
    jobRequests[jobIndex].assignedYouths[existingYouthIndex] = {
      ...jobRequests[jobIndex].assignedYouths[existingYouthIndex],
      name: name || jobRequests[jobIndex].assignedYouths[existingYouthIndex].name, // Update the name if provided
    };
  } else {
    // Add the new youth with default status
    jobRequests[jobIndex].assignedYouths.push({
      id: youthId,
      name: name || "Unknown", // Use "Unknown" if name is not provided
      status: "waiting", // Default status
    });
  }

  // Save the updated job requests array back to the file
  writeFile(jobRequests);

  res.status(200).json({
    message: `Youth with ID ${youthId} has been assigned to Job Request with ID ${id}.`,
    updatedJobRequest: jobRequests[jobIndex],
  });
};

export const updateJobRequestStatus = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract jobRequest ID from route parameters
  const { status } = req.body; // Extract the new status from the request body

  // Validate that a status is provided
  if (!status) {
    res.status(400).json({ message: 'Status is required' });
    return;
  }

  const jobRequests: Job[] = readFile(); // Read the current job requests data

  const jobIndex = jobRequests.findIndex((job) => job.id === id);

  // Check if the job request exists
  if (jobIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }

  // Update the status of the job request
  jobRequests[jobIndex].status = status;

  // Save the updated job requests back to the file
  writeFile(jobRequests);

  res.status(200).json({
    message: `Job Request with ID ${id} status updated to '${status}'.`,
    updatedJobRequest: jobRequests[jobIndex],
  });
};
