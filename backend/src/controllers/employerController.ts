
import { Request, Response } from 'express';
import Employer from '../models/employer';
import Signature from '../models/signature';

// Get all employers
export const getAllEmployers = async (req: Request, res: Response): Promise<void> => {
  try {
    const employers = await Employer.findAll();
    res.status(200).json(employers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employers', error });
  }
};

// Create a new employer
export const createEmployer = async (req: Request, res: Response): Promise<void> => {
  try {
    const newEmployer = req.body;
    newEmployer.id = newEmployer.id || `${Date.now()}`; // Generate a unique ID if not provided

    // Step 1: Create the Employer record
    const employer = await Employer.create(newEmployer);

    // Step 2: Create the Signature record (if signature exists)
    if (newEmployer.signature) {
      await Signature.create({
        id: `${newEmployer.id}-signature`,
        employerId: newEmployer.id, // Use the ID of the newly created Employer
        signatureImage: newEmployer.signature,
      });

      // Update the employer's signature field (if needed)
      employer.signature = `/assets/data/signatures.json#${newEmployer.id}-signature`;
      await employer.save(); // Save the updated employer record
    }

    res.status(201).json(employer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating employer', error });
  }
};

// Get signature by employer ID
export const getSignatureByEmployerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const signature = await Signature.findOne({ where: { employerId: id } });

    if (!signature) {
      res.status(404).json({ message: `No signature found for employer with ID ${id}.` });
      return;
    }

    res.status(200).json(signature);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching signature', error });
  }
};

// Get employer by ID
export const getEmployerById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employer = await Employer.findByPk(id);

    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    res.status(200).json(employer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employer', error });
  }
};

// Delete employer by ID
export const deleteEmployer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employer = await Employer.findByPk(id);

    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    await employer.destroy();
    res.status(200).json({ message: `Employer with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting employer', error });
  }
};

// Upload profile image
export const uploadProfileImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { image } = req.body;

    if (!image) {
      res.status(400).json({ message: 'No image data provided.' });
      return;
    }

    const employer = await Employer.findByPk(id);

    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    employer.profileImage = `/assets/data/images.json#${id}`;
    await employer.save();

    res.status(200).json({
      message: 'Profile image updated successfully.',
      imageUrl: employer.profileImage,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile image', error });
  }
};

export const updateEmployer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData: Partial<Employer> = req.body;

    const employer = await Employer.findByPk(id);
    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    await employer.update(updatedData);
    res.status(200).json({
      message: `Employer with ID ${id} updated successfully.`,
      updatedEmployer: employer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating employer', error });
  }
};

// Update employer's active status
export const updateActiveStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isActive }: { isActive: boolean } = req.body;

    const employer = await Employer.findByPk(id);
    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    employer.active = isActive;
    await employer.save();

    res.status(200).json({
      message: `Employer with ID ${id} active status updated successfully.`,
      updatedEmployer: employer,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating active status', error });
  }
};


// Get organization name by employer ID
export const getOrganizationNameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const employer = await Employer.findByPk(id);

    if (!employer) {
      res.status(404).json({ message: `Employer with ID ${id} not found.` });
      return;
    }

    res.status(200).json({ organizationName: employer.organization });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching organization name', error });
  }
};
