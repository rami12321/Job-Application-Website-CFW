
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


  const { jobId, ...jobRequestData } = req.body;
  const newJobRequest: Job = {
    jobId: generateUniqueId(),
    ...jobRequestData,
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
  const jobRequest = jobRequests.find((e) => e.jobId === id);

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
  const jobRequestIndex = jobRequests.findIndex((e) => e.jobId === id);

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
  const jobRequestIndex = jobRequests.findIndex((e) => e.jobId === id);

  if (jobRequestIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }

  const deletedJobRequest = jobRequests.splice(jobRequestIndex, 1);
  writeFile(jobRequests);

  res.status(200).json({ message: `Job Request with ID ${id} deleted successfully.`, deletedJobRequest });
};

export const assignYouthToJobRequest = (req: Request, res: Response): void => {
  const { id, youthId } = req.params;
  const jobRequests: Job[] = readFile();
  const youthData: Youth[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../public/assets/data/youthdb.json'), 'utf-8') || '[]');

  const jobIndex = jobRequests.findIndex((job) => job.jobId === id);


  if (jobIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }


  const youth = youthData.find((y) => y.id === youthId);


  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${youthId} not found.` });
    return;
  }


  if (!jobRequests[jobIndex].assignedYouths) {
    jobRequests[jobIndex].assignedYouths = [];
  }


  const existingYouthIndex = jobRequests[jobIndex].assignedYouths.findIndex((y) => y.id === youthId);

  if (existingYouthIndex !== -1) {

    jobRequests[jobIndex].assignedYouths[existingYouthIndex] = {
      ...jobRequests[jobIndex].assignedYouths[existingYouthIndex],
      firstName: youth.firstNameEn,
      lastName: youth.lastNameEn,
      dob: youth.dob,
      cv: youth.cv,
      status: "waiting",
    };
  } else {

    jobRequests[jobIndex].assignedYouths.push({
      id: youthId,
      firstName: youth.firstNameEn,
      lastName: youth.lastNameEn,
      dob: youth.dob,
      cv: youth.cv,
      status: "waiting",
    });
  }


  writeFile(jobRequests);

  res.status(200).json({
    message: `Youth with ID ${youthId} has been assigned to Job Request with ID ${id}.`,
    updatedJobRequest: jobRequests[jobIndex],
  });
};

export const unassignYouthFromJobRequest = (req: Request, res: Response): void => {
  const { id, youthId } = req.params; // Extract jobRequest ID and youth ID from route parameters

  const jobRequests: Job[] = readFile(); // Read the current job requests data

  const jobIndex = jobRequests.findIndex((job) => job.jobId === id);

  // Check if the job request exists
  if (jobIndex === -1) {
    res.status(404).json({ message: `Job Request with ID ${id} not found.` });
    return;
  }

  const assignedYouths = jobRequests[jobIndex].assignedYouths || [];

  // Check if the youth is assigned to the job
  const youthIndex = assignedYouths.findIndex((youth) => youth.id === youthId);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${youthId} is not assigned to Job Request with ID ${id}.` });
    return;
  }

  // Remove the youth from the assignedYouths array
  assignedYouths.splice(youthIndex, 1);

  // Update the job request
  jobRequests[jobIndex].assignedYouths = assignedYouths;

  // Save the updated job requests back to the file
  writeFile(jobRequests);

  res.status(200).json({
    message: `Youth with ID ${youthId} has been unassigned from Job Request with ID ${id}.`,
    updatedJobRequest: jobRequests[jobIndex],
  });
};

export const getAssignedYouthsByJobId = (req: Request, res: Response): void => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ message: 'Employer ID is required' });
    return;
  }

  const jobRequests: Job[] = readFile();
  const filteredJobs = jobRequests.filter((job) => job.jobId === id);

  if (filteredJobs.length === 0) {
    res.status(404).json({ message: `No job requests found for employer with ID ${id}` });
    return;
  }

  const assignedYouths = filteredJobs.flatMap((job) => job.assignedYouths || []);

  res.status(200).json(assignedYouths);
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

  const jobIndex = jobRequests.findIndex((job) => job.jobId === id);

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
