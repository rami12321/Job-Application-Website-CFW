import { Request, Response } from 'express';
import Youth from '../models/youth'; // Import the Youth model

// Get all youths
export const getAllYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const youths = await Youth.findAll();
    res.status(200).json(youths);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching youths', error });
  }
};

// Create a new youth
export const createYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const newYouth = req.body;
    newYouth.createdAt = new Date().toISOString(); // Add createdAt timestamp
    newYouth.isEdited = false; // Set isEdited to false by default

    const createdYouth = await Youth.create(newYouth);
    res.status(201).json(createdYouth);
  } catch (error) {
    res.status(500).json({ message: 'Error creating youth', error });
  }
};

// Update youth camp
export const updateYouthCamp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { camp } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.camp = camp || null; // Update or clear the camp field
    await youth.save();

    res.status(200).json({
      message: `Youth with ID ${id} updated successfully.`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth camp', error });
  }
};

// Get youth by ID
export const getYouthById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const youth = await Youth.findByPk(id);

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    res.status(200).json(youth);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching youth', error });
  }
};

// Delete youth by ID
export const deleteYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const youth = await Youth.findByPk(id);

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    await youth.destroy();
    res.status(200).json({ message: `Youth with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting youth', error });
  }
};

// Update youth
export const updateYouth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData: Partial<Youth> = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    await youth.update(updatedData);
    res.status(200).json({
      message: `Youth with ID ${id} updated successfully.`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth', error });
  }
};

// Update youth trainings
export const updateYouthTraining = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { trainings } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.trainings = trainings;
    await youth.save();

    res.status(200).json({ message: 'Youth trainings updated successfully', youth });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth trainings', error });
  }
};

// Update youth experiences
export const updateYouthExperience = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { experiences } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.experiences = experiences;
    await youth.save();

    res.status(200).json({ message: 'Youth experiences updated successfully', youth });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth experiences', error });
  }
};

// Update youth status
export const updateYouthStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.status = status;
    await youth.save();

    res.status(200).json({
      message: `Youth with ID ${id} status updated successfully.`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth status', error });
  }
};

// Update applied jobs
export const updateAppliedJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { appliedJob } = req.body;

    if (!Array.isArray(appliedJob)) {
      res.status(400).json({ message: 'Applied jobs must be an array.' });
      return;
    }

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.appliedJob = appliedJob;
    await youth.save();

    res.status(200).json({
      message: `Applied jobs updated for Youth ID: ${id}`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating applied jobs', error });
  }
};

// Check if a registration number is in use
export const checkRegistrationNumber = async (req: Request, res: Response): Promise<void> => {
  try {
    const { personalRegistrationNumber } = req.body;
    const youth = await Youth.findOne({ where: { personalRegistrationNumber } });

    if (youth) {
      res.status(200).json({ inUse: true, message: `Registration number ${personalRegistrationNumber} is already in use.` });
    } else {
      res.status(200).json({ inUse: false, message: `Registration number ${personalRegistrationNumber} is available.` });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error checking registration number', error });
  }
};

// Get applied jobs by youth ID
export const getAppliedJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const youth = await Youth.findByPk(id);

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    if (!youth.appliedJob || youth.appliedJob.length === 0) {
      res.status(404).json({ message: `No applied jobs found for youth with ID ${id}.` });
      return;
    }

    res.status(200).json({ appliedJobs: youth.appliedJob });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applied jobs', error });
  }
};

// Update youth notes
export const updateYouthNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.notes = notes;
    await youth.save();

    res.status(200).json({
      message: `Youth with ID ${id} notes updated successfully.`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating youth notes', error });
  }
};

// Get youth notes by ID
export const getYouthNotesById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const youth = await Youth.findByPk(id);

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    if (!youth.notes) {
      res.status(404).json({ message: `No notes found for youth with ID ${id}.` });
      return;
    }

    res.status(200).json({ notes: youth.notes });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching youth notes', error });
  }
};

// Get youths by applied job
export const getYouthByJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const { appliedJob } = req.params;
    const youths = await Youth.findAll();

    const filteredYouths = youths.filter((y) =>
      Array.isArray(y.appliedJob) && y.appliedJob.some((jobObj) => jobObj.req === appliedJob)
    );

    if (filteredYouths.length === 0) {
      res.status(200).json({ message: `No youths found who applied for job: ${appliedJob}.` });
      return;
    }

    const result = filteredYouths.map((y) => ({
      id: y.id,
      name: `${y.firstNameEn} ${y.lastNameEn}` || 'Unknown',
      notes: y.notes || [],
      beneficiary: y.beneficiary || false,
      workStatus: y.workStatus || false,
    }));

    res.status(200).json({ youths: result });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching youths by job', error });
  }
};

// Update youth isEdited status
export const updateYouthIsEdited = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { isEdited } = req.body;

    const youth = await Youth.findByPk(id);
    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    youth.isEdited = isEdited;
    await youth.save();

    res.status(200).json({
      message: `Youth with ID ${id} 'isEdited' updated successfully.`,
      updatedYouth: youth,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating isEdited status', error });
  }
};

// Get youth isEdited status by ID
export const getYouthIsEditedStatusById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const youth = await Youth.findByPk(id);

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${id} not found.` });
      return;
    }

    res.status(200).json({ isEdited: youth.isEdited || false });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching isEdited status', error });
  }
};
