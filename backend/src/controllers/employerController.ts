
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


// export const updateEmployer = (req: Request, res: Response): void => {
//   const { id } = req.params;
//   const updatedData: Partial<Employer> = req.body;
//   let employers: Employer[] = readFile();
//   const employerIndex = employers.findIndex((e) => e.id === id);

//   if (employerIndex === -1) {
//     res.status(404).json({ message: `Employer with ID ${id} not found.` });
//     return;
//   }
//   const updatedEmployer = { ...employers[employerIndex], ...updatedData };
//   employers[employerIndex] = updatedEmployer;
//   writeFile(employers);
//   res.status(200).json({ message: `Employer with ID ${id} updated successfully.`, updatedEmployer });
// };

// export const updateActiveStatus = (req: Request, res: Response): void => {
//   const { id } = req.params;
//   const { isActive }: { isActive: boolean } = req.body; // Expecting a boolean value to update the active status

//   let employers: Employer[] = readFile();
//   const employerIndex = employers.findIndex((e) => e.id === id);

//   if (employerIndex === -1) {
//     res.status(404).json({ message: `Employer with ID ${id} not found.` });
//     return;
//   }

//   // Update the employer's active status
//   employers[employerIndex].active = isActive;

//   // Save the updated employer list
//   writeFile(employers);

//   res.status(200).json({
//     message: `Employer with ID ${id} active status updated successfully.`,
//     updatedEmployer: employers[employerIndex],
//   });
// };

// import { Youth } from '../models/youth';
// export const assignYouthToEmployer = (req: Request, res: Response): void => {
//   const { id, youthId } = req.params;
//   let employers: Employer[] = readFile();
//   const youthData: Youth[] = JSON.parse(fs.readFileSync(path.join(__dirname, '../../../public/assets/data/youthdb.json'), 'utf-8') || '[]');
//   const employerIndex = employers.findIndex((e) => e.id === id);
//   if (employerIndex === -1) {
//     res.status(404).json({ message: `Employer with ID ${id} not found.` });
//     return;
//   }
//   const youth = youthData.find((y) => y.id === youthId);
//   if (!youth) {
//     res.status(404).json({ message: `Youth with ID ${youthId} not found.` });
//     return;
//   }
//   if (!employers[employerIndex].assignedYouths) {
//     employers[employerIndex].assignedYouths = [];
//   }
//   const existingYouthIndex = employers[employerIndex].assignedYouths.findIndex((y) => y.id === youthId);
//   if (existingYouthIndex !== -1) {
//     employers[employerIndex].assignedYouths[existingYouthIndex] = {
//       ...employers[employerIndex].assignedYouths[existingYouthIndex],
//       firstName: youth.firstNameEn,
//       lastName: youth.lastNameEn,
//       dob: youth.dob,
//       cv: youth.cv,
//       status: "waiting",
//     };
//   } else {
//     employers[employerIndex].assignedYouths.push({
//       id: youthId,
//       firstName: youth.firstNameEn,
//       lastName: youth.lastNameEn,
//       dob: youth.dob,
//       cv: youth.cv,
//       status: "waiting",
//     });
//   }
//   writeFile(employers);
//   res.status(200).json({
//     message: `Youth with ID ${youthId} has been assigned to employer with ID ${id}.`,
//     updatedEmployer: employers[employerIndex],
//   });
// };

// // Function to get the organization name by employer ID
// export const getOrganizationNameById = (req: Request, res: Response): void => {
//   const { id } = req.params;
//   const employers: Employer[] = readFile(); // Read all employers data

//   // Find the employer by ID
//   const employer = employers.find((e) => e.id === id);

//   if (!employer) {
//     // If employer not found, return a 404 error
//     res.status(404).json({ message: `Employer with ID ${id} not found.` });
//     return;
//   }

//   // If employer found, return the organization name
//   res.status(200).json({ organizationName: employer.organization });
// };


