
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Employer } from '../models/employer';

const filePath = path.join(__dirname, '../../../public/assets/data/employers.json');
const imagesFilePath = path.join(__dirname, '../../../public/assets/data/images.json');
const signatureFilePath = path.join(__dirname, '../../../public/assets/data/signatures.json');


const readFile = (): Employer[] => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data || '[]');
};

const writeFile = (data: Employer[]): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('Data written successfully.');
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};



export const getAllEmployers = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  res.status(200).json(employers);
};
export interface Signature {
  id: string;
  employerId: string;
  signatureImage: string;
}


export const createEmployer = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  const newEmployer: Employer = req.body;


  newEmployer.id = newEmployer.id || `${employers.length + 1}`;


  if (newEmployer.signature) {
    const signatureFileData: Signature[] = fs.existsSync(signatureFilePath)
      ? JSON.parse(fs.readFileSync(signatureFilePath, 'utf-8') || '[]')
      : [];

    const signatureEntry: Signature = {
      id: `${newEmployer.id}-signature`,
      employerId: newEmployer.id,
      signatureImage: newEmployer.signature,
    };


    signatureFileData.push(signatureEntry);
    fs.writeFileSync(signatureFilePath, JSON.stringify(signatureFileData, null, 2), 'utf-8');


    newEmployer.signature = `/assets/data/signatures.json#${signatureEntry.id}`;
  }


  employers.push(newEmployer);
  writeFile(employers);

  res.status(201).json(newEmployer);
};

export const getSignatureByEmployerId = (req: Request, res: Response): void => {
  const { id } = req.params;

  if (!fs.existsSync(signatureFilePath)) {
    res.status(404).json({ message: 'No signatures found.' });
    return;
  }

  const signatures: Signature[] = JSON.parse(fs.readFileSync(signatureFilePath, 'utf-8') || '[]');
  const signature = signatures.find((s) => s.employerId === id);

  if (!signature) {
    res.status(404).json({ message: `No signature found for employer with ID ${id}.` });
    return;
  }

  res.status(200).json(signature);
};



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


export const deleteEmployer = (req: Request, res: Response): void => {
  const { id } = req.params;
  let employers: Employer[] = readFile();
  const employerIndex = employers.findIndex((e) => e.id === id);

  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  const deletedEmployer = employers.splice(employerIndex, 1);
  writeFile(employers);

  res.status(200).json({ message: `Employer with ID ${id} deleted successfully.`, deletedEmployer });
};

export const uploadProfileImage = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { image } = req.body;

  if (!image) {
    res.status(400).json({ message: 'No image data provided.' });
    return;
  }
  const employers: Employer[] = readFile();
  const employer = employers.find((e) => e.id === id);

  if (!employer) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }
  const imageKey = `${id}`;
  let images: { key: string; data: string }[] = [];
  if (fs.existsSync(imagesFilePath)) {
    images = JSON.parse(fs.readFileSync(imagesFilePath, 'utf-8') || '[]');
  }
  images.push({ key: imageKey, data: image });
  try {
    fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2));
    console.log('Image data written to images.json');
  } catch (error) {
    console.error('Error writing image data:', error);
    res.status(500).json({ message: 'Failed to save image data.' });
    return;
  }
  employer.profileImage = `/assets/data/images.json#${imageKey}`;
  writeFile(employers);

  res.status(200).json({
    message: 'Profile image updated successfully.',
    imageUrl: employer.profileImage,
  });
};


export const updateEmployer = (req: Request, res: Response): void => {
  const { id } = req.params;
  const updatedData: Partial<Employer> = req.body;
  let employers: Employer[] = readFile();
  const employerIndex = employers.findIndex((e) => e.id === id);

  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }
  const updatedEmployer = { ...employers[employerIndex], ...updatedData };
  employers[employerIndex] = updatedEmployer;
  writeFile(employers);
  res.status(200).json({ message: `Employer with ID ${id} updated successfully.`, updatedEmployer });
};

export const updateActiveStatus = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { isActive }: { isActive: boolean } = req.body; // Expecting a boolean value to update the active status

  let employers: Employer[] = readFile();
  const employerIndex = employers.findIndex((e) => e.id === id);

  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  // Update the employer's active status
  employers[employerIndex].active = isActive;

  // Save the updated employer list
  writeFile(employers);

  res.status(200).json({
    message: `Employer with ID ${id} active status updated successfully.`,
    updatedEmployer: employers[employerIndex],
  });
};

import { Youth } from '../models/youth';
export const assignYouthToEmployer = (req: Request, res: Response): void => {
  const { id, youthId } = req.params;
  let employers: Employer[] = readFile();
  const youthData: Youth[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../public/assets/data/youthdb.json'), 'utf-8') || '[]');
  const employerIndex = employers.findIndex((e) => e.id === id);
  if (employerIndex === -1) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }
  const youth = youthData.find((y) => y.id === youthId);
  if (!youth) {
    res.status(404).json({ message: `Youth with ID ${youthId} not found.` });
    return;
  }
  if (!employers[employerIndex].assignedYouths) {
    employers[employerIndex].assignedYouths = [];
  }
  const existingYouthIndex = employers[employerIndex].assignedYouths.findIndex((y) => y.id === youthId);
  if (existingYouthIndex !== -1) {
    employers[employerIndex].assignedYouths[existingYouthIndex] = {
      ...employers[employerIndex].assignedYouths[existingYouthIndex],
      firstName: youth.firstNameEn,
      lastName: youth.lastNameEn,
      dob: youth.dob,
      cv: youth.cv,
      status: "waiting",
    };
  } else {
    employers[employerIndex].assignedYouths.push({
      id: youthId,
      firstName: youth.firstNameEn,
      lastName: youth.lastNameEn,
      dob: youth.dob,
      cv: youth.cv,
      status: "waiting",
    });
  }
  writeFile(employers);
  res.status(200).json({
    message: `Youth with ID ${youthId} has been assigned to employer with ID ${id}.`,
    updatedEmployer: employers[employerIndex],
  });
};

// Function to get the organization name by employer ID
export const getOrganizationNameById = (req: Request, res: Response): void => {
  const { id } = req.params;
  const employers: Employer[] = readFile(); // Read all employers data

  // Find the employer by ID
  const employer = employers.find((e) => e.id === id);

  if (!employer) {
    // If employer not found, return a 404 error
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  // If employer found, return the organization name
  res.status(200).json({ organizationName: employer.organization });
};


