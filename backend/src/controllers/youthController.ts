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
  const youths: Youth[] = readFile();
  const newYouth: Youth = req.body;

  // Generate the ID and assign it to the new youth

  youths.push(newYouth);
  writeFile(youths);
  res.status(201).json(newYouth);
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
export const updateJob = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { jobCategory } = req.body;  // Extract the new status from the request body
  let youths: Youth[] = readFile();

  // Check if status is provided
  if (!jobCategory) {
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
  youths[youthIndex].jobCategory = jobCategory;

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
