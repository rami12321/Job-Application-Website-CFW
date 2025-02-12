import { Request, Response } from 'express';
import Job from '../models/jobRequest';
import Youth from '../models/youth';

// Get all job requests
export const getAllJobRequests = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobRequests = await Job.findAll();
    res.status(200).json(jobRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job requests', error });
  }
};

// Get jobs by employer ID
export const getJobsByEmployerId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { employerId } = req.params;

    if (!employerId) {
      res.status(400).json({ message: 'Employer ID is required' });
      return;
    }

    const jobRequests = await Job.findAll({ where: { employerId } });

    if (jobRequests.length === 0) {
      res.status(404).json({ message: `No jobs found for employer with ID ${employerId}` });
      return;
    }

    res.status(200).json(jobRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs by employer ID', error });
  }
};

// Create a new job request
export const createJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId, ...jobRequestData } = req.body;

    const newJobRequest = await Job.create({
      jobId: generateUniqueId(),
      ...jobRequestData,
    });

    res.status(201).json(newJobRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error creating job request', error });
  }
};

// Get a job request by ID
export const getJobRequestById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    res.status(200).json(jobRequest);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job request', error });
  }
};

// Update a job request
export const updateJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updatedData: Partial<Job> = req.body;

    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    await jobRequest.update(updatedData);

    res.status(200).json({
      message: `Job request with ID ${id} updated successfully.`,
      updatedJobRequest: jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job request', error });
  }
};

// Delete a job request
export const deleteJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    await jobRequest.destroy();

    res.status(200).json({ message: `Job request with ID ${id} deleted successfully.` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job request', error });
  }
};

// Assign a youth to a job request
export const assignYouthToJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, youthId } = req.params;

    const jobRequest = await Job.findByPk(id);
    const youth = await Youth.findByPk(youthId);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    if (!youth) {
      res.status(404).json({ message: `Youth with ID ${youthId} not found.` });
      return;
    }

    const assignedYouths = jobRequest.assignedYouths || [];

    const existingYouthIndex = assignedYouths.findIndex((y) => y.id === youthId);

    if (existingYouthIndex !== -1) {
      // Update existing youth assignment
      assignedYouths[existingYouthIndex] = {
        ...assignedYouths[existingYouthIndex],
        firstName: youth.firstNameEn,
        lastName: youth.lastNameEn,
        dob: youth.dob,
        cv: youth.cv,
        status: 'waiting',
      };
    } else {
      // Add new youth assignment
      assignedYouths.push({
        id: youthId,
        firstName: youth.firstNameEn,
        lastName: youth.lastNameEn,
        dob: youth.dob,
        cv: youth.cv,
        status: 'waiting',
      });
    }

    await jobRequest.update({ assignedYouths });

    res.status(200).json({
      message: `Youth with ID ${youthId} has been assigned to Job Request with ID ${id}.`,
      updatedJobRequest: jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning youth to job request', error });
  }
};

// Unassign a youth from a job request
export const unassignYouthFromJobRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, youthId } = req.params;

    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    const assignedYouths = jobRequest.assignedYouths || [];

    const youthIndex = assignedYouths.findIndex((y) => y.id === youthId);

    if (youthIndex === -1) {
      res.status(404).json({ message: `Youth with ID ${youthId} is not assigned to Job Request with ID ${id}.` });
      return;
    }

    assignedYouths.splice(youthIndex, 1);

    await jobRequest.update({ assignedYouths });

    res.status(200).json({
      message: `Youth with ID ${youthId} has been unassigned from Job Request with ID ${id}.`,
      updatedJobRequest: jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error unassigning youth from job request', error });
  }
};

// Get assigned youths by job ID
export const getAssignedYouthsByJobId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    const assignedYouths = jobRequest.assignedYouths || [];

    res.status(200).json(assignedYouths);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned youths', error });
  }
};

// Update job request status
export const updateJobRequestStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ message: 'Status is required' });
      return;
    }

    const jobRequest = await Job.findByPk(id);

    if (!jobRequest) {
      res.status(404).json({ message: `Job request with ID ${id} not found.` });
      return;
    }

    await jobRequest.update({ status });

    res.status(200).json({
      message: `Job request with ID ${id} status updated to '${status}'.`,
      updatedJobRequest: jobRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating job request status', error });
  }
};

// Helper function to generate a unique ID
function generateUniqueId(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
  return `${randomLetter}-${randomNumber}`;
}
