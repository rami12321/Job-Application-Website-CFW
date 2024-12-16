// src/controllers/employerController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { Employer } from '../models/employer';

const filePath = path.join(__dirname, '../../../public/assets/data/employers.json');
const imagesFilePath = path.join(__dirname, '../../../public/assets/data/images.json');
const signatureFilePath = path.join(__dirname, '../../../public/assets/data/signatures.json');

// Utility functions
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


// Get all employers
export const getAllEmployers = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  res.status(200).json(employers);
};
export interface Signature {
  id: string; // A unique identifier for the signature
  employerId: string; // Links the signature to the employer
  signatureImage: string; // Base64-encoded image of the signature
}

//Create New Employer
export const createEmployer = (req: Request, res: Response): void => {
  const employers: Employer[] = readFile();
  const newEmployer: Employer = req.body; // Ensure req.body adheres to Employer type

  // Generate the ID and assign it to the new employer
  newEmployer.id = newEmployer.id || `${employers.length + 1}`;

  // Process signature (if provided)
  if (newEmployer.signature) {
    const signatureFileData :Signature[] = fs.existsSync(signatureFilePath)
      ? JSON.parse(fs.readFileSync(signatureFilePath, 'utf-8') || '[]')
      : [];

    const signatureEntry : Signature={
      id: `${newEmployer.id}-signature`,
      employerId: newEmployer.id,
      signatureImage: newEmployer.signature,
    };

    // Add signature to signature.json
    signatureFileData.push(signatureEntry);
    fs.writeFileSync(signatureFilePath, JSON.stringify(signatureFileData, null, 2), 'utf-8');

    // Replace the signature field in employers.json with the signature URL
    newEmployer.signature = `/assets/data/signatures.json#${signatureEntry.id}`;
  }

  // Add employer to the employers array
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

export const uploadProfileImage = (req: Request, res: Response): void => {
  const { id } = req.params;
  const { image } = req.body; // Image is expected as a base64 string

  if (!image) {
    res.status(400).json({ message: 'No image data provided.' });
    return;
  }

  // Read employer data
  const employers: Employer[] = readFile();
  const employer = employers.find((e) => e.id === id);

  if (!employer) {
    res.status(404).json({ message: `Employer with ID ${id} not found.` });
    return;
  }

  // Generate unique image key
  const imageKey = `${id}`;

  // Read images.json file
  let images: { key: string; data: string }[] = [];
  if (fs.existsSync(imagesFilePath)) {
    images = JSON.parse(fs.readFileSync(imagesFilePath, 'utf-8') || '[]');
  }

  // Add the new image data
  images.push({ key: imageKey, data: image });

  // Write back to images.json
  try {
    fs.writeFileSync(imagesFilePath, JSON.stringify(images, null, 2));
    console.log('Image data written to images.json');
  } catch (error) {
    console.error('Error writing image data:', error);
    res.status(500).json({ message: 'Failed to save image data.' });
    return;
  }

  // Update employer's profile image reference
  employer.profileImage = `/assets/data/images.json#${imageKey}`;
  writeFile(employers);

  res.status(200).json({
    message: 'Profile image updated successfully.',
    imageUrl: employer.profileImage,
  });
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
