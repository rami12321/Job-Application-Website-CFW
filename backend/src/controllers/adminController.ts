import { Request, Response } from 'express';
import Admin from '../models/Admin';

// Get all admins
export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const admins = await Admin.findAll();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error });
  }
};

// Create a new admin
export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const newAdmin = req.body;
    newAdmin.id = newAdmin.id || `${Date.now()}`; // Or rely on UUIDV4 default

    const admin = await Admin.create(newAdmin);
    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error });
  }
};

// Get admin by ID
export const getAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      res.status(404).json({ message: `Admin with ID ${id} not found.` });
      return;
    }

    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin', error });
  }
};

// Delete admin by ID
export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);

    if (!admin) {
      res.status(404).json({ message: `Admin with ID ${id} not found.` });
      return;
    }

    await admin.destroy();
    res.status(200).json({ message: `Admin with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting admin', error });
  }
};


// Update admin status
export const updateAdminStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) {
      res.status(404).json({ message: `Admin with ID ${id} not found.` });
      return;
    }

    admin.active = active;
    await admin.save();

    res.status(200).json({ message: `Admin status updated successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating admin status', error });
  }
};
