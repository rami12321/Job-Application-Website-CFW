import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Path to your JSON file for verification codes
const filePath = path.join(__dirname, '../../../public/assets/data/verification-codes.json');

// Utility functions to read and write to the file
export const readFile = (): { code: string }[] => {
  try {
    // Check if the file exists, if not, create it
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify([]));
    }

    // Read the file content
    const data = fs.readFileSync(filePath, 'utf-8');

    // Parse the content to a JavaScript object and return it
    return JSON.parse(data || '[]'); // Return an empty array if the data is empty
  } catch (error) {
    console.error('Error reading file:', error);
    return []; // Return an empty array if an error occurs
  }
};

const writeFile = (data: { code: string }[]): void => {
  try {
    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing to file:', error);
  }
};
// Generate a unique verification code (use UUID or any other logic)
const generateCode = (): string => {
  const min = 100000; // 6-digit number minimum
  const max = 999999; // 6-digit number maximum
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
};

// Controller functions

// Generate a new verification code
export const generateVerificationCode = (req: Request, res: Response): void => {
  const newCode = generateCode();
  const codes = readFile();

  // Save the new code to the database
  codes.push({ code: newCode });
  writeFile(codes);

  res.status(201).json({ code: newCode }); // Respond with the generated code
};

// Get all verification codes (optional, for debugging or listing)
export const getAllCodes = (req, res) => {
  try {
    const codes = readFile(); // Read the verification codes from the file
    res.json(codes); // Send the codes as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error reading verification codes' });
  }
};

// Delete a verification code after it has been used
export const deleteCode = (req: Request, res: Response): void => {
  const { code } = req.params; // Get the code from the URL parameter
  const codes = readFile(); // Read the existing codes from the database

  const codeIndex = codes.findIndex((c) => c.code === code);

  if (codeIndex === -1) {
    res.status(404).json({ message: `Code ${code} not found.` });
    return;
  }

  // Remove the code and update the file
  codes.splice(codeIndex, 1);
  writeFile(codes);

  res.status(200).json({ message: `Code ${code} deleted successfully.` });
};
