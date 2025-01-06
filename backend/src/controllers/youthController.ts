// src/controllers/youthController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Youth } from '../models/youth';

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



export const createYouth = (req: Request, res: Response): void => {
  const youths: Youth[] = readFile();  // Read existing youths from the file
  const newYouth: Youth = req.body;

  // Generate the current date and time for createdAt
  const createdAt = new Date().toISOString();  // ISO 8601 format string (e.g., "2024-12-19T12:34:56Z")

  // Add the createdAt field to the newYouth object
  const youthWithTimestamp: Youth = {
    ...newYouth,
    createdAt,
    isEdited:false,  // Add the createdAt field with the current timestamp
  };

  // Add the new youth with the timestamp to the list
  youths.push(youthWithTimestamp);
  writeFile(youths);  // Write thd list of youths back to the file

  res.status(201).json(youthWithTimestamp);  // Return the newly created youth with the createdAt field
};
export const updateYouthCamp = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract user ID from request parameters
  const { camp } = req.body; // Extract the `camp` field from the request body

  // Read the current youth data
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  // Check if the youth exists
  if (youthIndex === -1) {
     res.status(404).json({ message: `Youth with ID ${id} not found.` }); // Ensure no further code execution
     return;
  }

  // Update or clear the `camp` field
  if (camp === null || camp === undefined) {
    delete youths[youthIndex].camp; // Remove the `camp` field if null or undefined
  } else {
    youths[youthIndex].camp = camp; // Update the `camp` field
  }

  // Save the updated data back to the file
  fs.writeFile(filePath, JSON.stringify(youths, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing updated youth data to file.' }); // Exit on error
    }

    // Respond with the updated youth data
    return res.status(200).json({
      message: `Youth with ID ${id} updated successfully.`,
      updatedYouth: youths[youthIndex],
    });
  });
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
export const updateYouth = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData: Partial<Youth> = req.body; // Accept partial updates

  // Read the current youth data
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
     res.status(404).json({ message: `Youth with ID ${id} not found.` });
     return;
  }

  // Update the youth data
  youths[youthIndex] = { ...youths[youthIndex], ...updatedData };

  // Save the updated data back to the file
  fs.writeFile(filePath, JSON.stringify(youths, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing updated youth data to file.' });
    }

    // Respond with the updated youth data
    return res.status(200).json({
      message: `Youth with ID ${id} updated successfully.`,
      updatedYouth: youths[youthIndex],
    });
  });
};

export const updateYouthTraining = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedTrainings: any[] = req.body.trainings; // Extract the updated trainings

  // Read the current youth data
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update only the trainings field
  youths[youthIndex].trainings = updatedTrainings;

  // Save the updated data back to the file
  try {
    writeFile(youths);
    res.status(200).json({ message: 'Youth trainings updated successfully', youth: youths[youthIndex] });
  } catch (error) {
    console.error('Error updating youth trainings:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};
export const updateYouthExperience = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedExperiences: any[] = req.body.experiences; // Assuming the payload has the 'experiences' field

  // Read the current youth data
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update only the experiences field
  youths[youthIndex].experiences = updatedExperiences;

  // Save the updated data back to the file
  try {
    writeFile(youths);
    res.status(200).json({ message: 'Youth experiences updated successfully', youth: youths[youthIndex] });
  } catch (error) {
    console.error('Error updating youth experiences:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

export const updateYouthStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { status } = req.body;  // Extract the new status from the request body
  let youths: Youth[] = readFile();

  // Check if status is provided
  if (!status) {
    res.status(400).json({ message: 'Status is required.' });
    return;
  }

  // Find the youth by ID
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update the status
  youths[youthIndex].status = status;

  // Save the updated youths array back to the file
  writeFile(youths);

  res.status(200).json({ message: `Youth with ID ${id} status updated successfully.`, updatedYouth: youths[youthIndex] });
};
// Controller for updating the appliedJob field
export const updateAppliedJob = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { appliedJob } = req.body;

  if (!appliedJob || !Array.isArray(appliedJob)) {
    res.status(400).json({ message: 'Applied jobs must be an array.' });
    return;
  }

  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex(y => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Log received jobs for debugging
  console.log("Received Applied Jobs:", appliedJob);

  appliedJob.forEach(job => {
    if (!job.status) {
      job.status = 'waiting';  // Default status to 'waiting'
    }
  });

  // Log the structure of the applied jobs after applying default status
  console.log("Updated Applied Jobs:", appliedJob);

  // Update the appliedJob field
  youths[youthIndex].appliedJob = appliedJob;

  // Save the updated list
  writeFile(youths);

  res.status(200).json({
    message: `Applied jobs updated for Youth ID: ${id}`,
    updatedYouth: youths[youthIndex]
  });
};


export const updateJob = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { appliedJob } = req.body;  // Extract the new status from the request body
  let youths: Youth[] = readFile();

  // Check if status is provided
  if (!appliedJob) {
    res.status(400).json({ message: 'job is required.' });
    return;
  }

  // Find the youth by ID
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update the status
  youths[youthIndex].appliedJob = appliedJob;

  // Save the updated youths array back to the file
  writeFile(youths);

  res.status(200).json({ message: `Youth with ID ${id} job updated successfully.`, updatedYouth: youths[youthIndex] });
};

export const checkRegistrationNumber = (req: Request, res: Response): void => {
  const { personalRegistrationNumber } = req.body; // Extract registration number from the request body
  const youths: Youth[] = readFile();

  // Check if registration number exists
  const isInUse = youths.some((youth) => youth.personalRegistrationNumber === personalRegistrationNumber);

  if (isInUse) {
    res.status(200).json({ inUse: true, message: `Registration number ${personalRegistrationNumber} is already in use.` });
  } else {
    res.status(200).json({ inUse: false, message: `Registration number ${personalRegistrationNumber} is available.` });
  }
};


export const getAppliedJobById = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract the ID from the request parameters
  const youths: Youth[] = readFile(); // Read all youth data from the file

  // Find the youth by ID
  const youth = youths.find((y) => y.id === id);

  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Check if the youth has applied for any jobs
  if (!youth.appliedJob || youth.appliedJob.length === 0) {
    res.status(404).json({ message: `No applied jobs found for youth with ID ${id}.` });
    return;
  }

  // Return the full appliedJob array
  res.status(200).json({ appliedJobs: youth.appliedJob });
};

export const updateYouthNotes = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { notes } = req.body;  // Extract the new notes from the request body
  let youths: Youth[] = readFile();

  // Check if notes are provided
  if (!notes) {
    res.status(400).json({ message: 'Notes are required.' });
    return;
  }

  // Find the youth by ID
  const youthIndex = youths.findIndex((y) => y.id === id);

  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update the notes
  youths[youthIndex].notes = notes;

  // Save the updated youths array back to the file
  writeFile(youths);

  res.status(200).json({ message: `Youth with ID ${id} notes updated successfully.`, updatedYouth: youths[youthIndex] });
};
export const getYouthNotesById = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract the ID from the request parameters
  const youths: Youth[] = readFile(); // Read all youth data from the file

  // Find the youth by ID
  const youth = youths.find((y) => y.id === id);

  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Check if the youth has notes
  if (!youth.notes) {
    res.status(404).json({ message: `No notes found for youth with ID ${id}.` });
    return;
  }

  // Return the notes
  res.status(200).json({ notes: youth.notes });
};


export const getYouthByJob = (req: Request, res: Response): void => {
  // Extract 'appliedJob' from req.params
  const { appliedJob } = req.params; // Get appliedJob from the URL parameters

  // Read the youth data (example function)
  const youths: Youth[] = readFile(); // Read the data from file or database

  // Filter youths who have the applied job in their appliedJob array
const filteredYouths = youths.filter((y) =>
  Array.isArray(y.appliedJob) && y.appliedJob.some((jobObj) => jobObj.job === appliedJob)
);
  // If no youths are found for the applied job, return 404 error
  if (filteredYouths.length === 0) {
    res.status(200).json({ message: `No youths found who applied for job: ${appliedJob}.` });
    return;
  }

  // Map and return the matching youths' names and notes
  const result = filteredYouths.map((y) => ({
    id:y.id,
    name: y.firstNameEn+ ' ' +y.lastNameEn || 'Unknown', // Use firstNameEn if available, otherwise 'Unknown'
    notes: y.notes || [] ,// Default to empty array if no notes available
    beneficiary: y.beneficiary ||false ,// Default to empty array if no notes available
    workStatus:y.workStatus||false
  }));

  // Send the response with the matching youths
  res.status(200).json({ youths: result });
};

export const updateYouthIsEdited = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract the youth ID from request parameters
  const { isEdited }: { isEdited: boolean } = req.body; // Extract the `isEdited` field from the request body

  // Read the current youth data
  let youths: Youth[] = readFile();
  const youthIndex = youths.findIndex((y) => y.id === id);

  // Check if the youth exists
  if (youthIndex === -1) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Update the `isEdited` field
  youths[youthIndex].isEdited = isEdited;

  // Save the updated data back to the file
  fs.writeFile(filePath, JSON.stringify(youths, null, 2), 'utf8', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error writing updated youth data to file.' });
    }

    // Respond with the updated youth data
    res.status(200).json({
      message: `Youth with ID ${id} 'isEdited' updated successfully.`,
      updatedYouth: youths[youthIndex],
    });
  });
};

// Get the isEdited status of a youth by ID
export const getYouthIsEditedStatusById = (req: Request, res: Response): void => {
  const { id } = req.params; // Extract the youth ID from request parameters
  const youths: Youth[] = readFile(); // Read the youth data from the file

  // Find the youth by ID
  const youth = youths.find((y) => y.id === id);

  // Check if the youth exists
  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${id} not found.` });
    return;
  }

  // Respond with the isEdited status
  res.status(200).json({ isEdited: youth.isEdited || false });
};
