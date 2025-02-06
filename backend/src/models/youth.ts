import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface YouthAttributes {
  id: string;
  username: string;
  password: string;
  role: string;

  // Personal Information
  firstNameEn: string;
  fatherNameEn?: string;
  lastNameEn: string;
  firstNameAr: string;
  fatherNameAr?: string;
  lastNameAr: string;
  gender: string;
  dob: string;
  nationality: string;
  registrationStatus: string;
  familyRegistrationNumber?: string;
  personalRegistrationNumber: string;
  mobilePhone: string;
  whatsapp: string;
  email: string;
  area: string;
  campType: string;
  camp?: string;
  fullAddress: string;

  // General Information
  jobOpportunitySource: string;
  educationLevel: string;
  major: string;
  institution: string;
  graduationDate: string;
  gradplace: string;
  employmentOpportunities: string;
  aboutYourself: string;

  // General Questions
  placedByKfw: boolean;
  kfwYear?: string;
  innovationLabGraduate: boolean;
  innovationLabGradtype: string[]; // Array of strings
  disability: boolean;
  disabilitySupport?: string;
  disabilityTypes: string[]; // Array of strings
  employed: boolean;

  seekingEmploymentDuration?: string;
  isPrcsVolunteer: boolean;
  isFireBrigadesVolunteer: boolean;
  isAlShifaaVolunteer: boolean;

  // Experience Details
  experiences: any[];

  // Trainings and Skills
  trainings: any[];
  computerSkills: string[]; // Array of strings
  skills?: {
    arabic: string;
    english: string;
    french: string;
  };

  // Required Documents
  cv: string;
  coverLetter?: string;
  identityCard: string;
  registrationCard: string;
  degree: string;
  prcsProof?: string;
  fireProof?: string;
  alShifaaProof?: string;
  confirmation: string;

  status: 'accepted' | 'rejected' | 'pending' | 'waiting';
  notes?: string;
  appliedJob?: { title: string; req: string; status: string; date: string , jobRequestId?: string}[]; // Updated to hold job and status
  beneficiary?: boolean;
  workStatus?: boolean;
  isEdited?: boolean;
}

interface YouthCreationAttributes extends Optional<YouthAttributes, 'id'> {}

class Youth extends Model<YouthAttributes, YouthCreationAttributes> implements YouthAttributes {
  public id!: string;
  public username!: string;
  public password!: string;
  public role!: string;

  // Personal Information
  public firstNameEn!: string;
  public fatherNameEn?: string;
  public lastNameEn!: string;
  public firstNameAr!: string;
  public fatherNameAr?: string;
  public lastNameAr!: string;
  public gender!: string;
  public dob!: string;
  public nationality!: string;
  public registrationStatus!: string;
  public familyRegistrationNumber?: string;
  public personalRegistrationNumber!: string;
  public mobilePhone!: string;
  public whatsapp!: string;
  public email!: string;
  public area!: string;
  public campType!: string;
  public camp?: string;
  public fullAddress!: string;

  // General Information
  public jobOpportunitySource!: string;
  public educationLevel!: string;
  public major!: string;
  public institution!: string;
  public graduationDate!: string;
  public gradplace!: string;
  public employmentOpportunities!: string;
  public aboutYourself!: string;

  // General Questions
  public placedByKfw!: boolean;
  public kfwYear?: string;
  public innovationLabGraduate!: boolean;
  public innovationLabGradtype!: string[];
  public disability!: boolean;
  public disabilitySupport?: string;
  public disabilityTypes!: string[];
  public employed!: boolean;

  public seekingEmploymentDuration?: string;
  public isPrcsVolunteer!: boolean;
  public isFireBrigadesVolunteer!: boolean;
  public isAlShifaaVolunteer!: boolean;

  // Experience Details
  public experiences!: any[];

  // Trainings and Skills
  public trainings!: any[];
  public computerSkills!: string[];
  public skills?: {
    arabic: string;
    english: string;
    french: string;
  };

  // Required Documents
  public cv!: string;
  public coverLetter?: string;
  public identityCard!: string;
  public registrationCard!: string;
  public degree!: string;
  public prcsProof?: string;
  public fireProof?: string;
  public alShifaaProof?: string;
  public confirmation!: string;

  public status!: 'accepted' | 'rejected' | 'pending' | 'waiting';
  public notes?: string;
  public   appliedJob?: { title: string; req: string; status: string; date: string , jobRequestId?: string}[]; // Updated to hold job and status

  public beneficiary?: boolean;
  public workStatus?: boolean;
  public isEdited?: boolean;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Youth.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUIDs
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // Personal Information
    firstNameEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherNameEn: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastNameEn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstNameAr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fatherNameAr: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastNameAr: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nationality: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    familyRegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    personalRegistrationNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsapp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    campType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    camp: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fullAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // General Information
    jobOpportunitySource: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    educationLevel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    major: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    institution: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    graduationDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gradplace: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employmentOpportunities: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aboutYourself: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    // General Questions
    placedByKfw: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    kfwYear: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    innovationLabGraduate: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    innovationLabGradtype: {
      type: DataTypes.JSON, // Use JSON for arrays
      allowNull: false,
    },
    disability: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    disabilitySupport: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    disabilityTypes: {
      type: DataTypes.JSON, // Use JSON for arrays
      allowNull: false,
    },
    employed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },

    seekingEmploymentDuration: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isPrcsVolunteer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isFireBrigadesVolunteer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isAlShifaaVolunteer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

    // Experience Details
    experiences: {
      type: DataTypes.JSON, // Use JSON for arrays
      allowNull: false,
    },

    // Trainings and Skills
    trainings: {
      type: DataTypes.JSON, // Use JSON for arrays
      allowNull: false,
    },
    computerSkills: {
      type: DataTypes.JSON, // Use JSON for arrays
      allowNull: true,
    },
    skills: {
      type: DataTypes.JSON, // Use JSON for objects
      allowNull: true,
    },

    // Required Documents
    cv: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    coverLetter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    identityCard: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registrationCard: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    degree: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prcsProof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fireProof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    alShifaaProof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    confirmation: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM('accepted', 'rejected', 'pending', 'waiting'),
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    appliedJob: {
      type: DataTypes.JSON, // Use JSON for arrays of objects
      allowNull: true,
    },
    beneficiary: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    workStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    isEdited: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },

  },
  {
    sequelize,
    tableName: 'youths',
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default Youth;
