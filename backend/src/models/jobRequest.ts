import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

export interface AssignedYouth {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  cv: string;
  status: string;
}
interface JobAttributes {
  jobId: string;
  employerId: string;
  job: string;
  category?: string;
  organizationName?: string;
  title?: string;
  numEmployees: number;
  level: string;
  area?: string;
  location: string;
  typeOfJob: string;
  supervisorName: string;
  supervisorPosition: string;
  supervisorEmail: string;
  supervisorPhone: string;
  status: 'pending' | 'active' | 'completed' | 'archived';
  assignedYouths?: AssignedYouth[];
}

interface JobCreationAttributes extends Optional<JobAttributes, 'jobId'> {}

class Job extends Model<JobAttributes, JobCreationAttributes> implements JobAttributes {
  public jobId!: string;
  public employerId!: string;
  public job!: string;
  public category?: string;
  public organizationName?: string;
  public title?: string;
  public numEmployees!: number;
  public level!: string;
  public area?: string;
  public location!: string;
  public typeOfJob!: string;
  public supervisorName!: string;
  public supervisorPosition!: string;
  public supervisorEmail!: string;
  public supervisorPhone!: string;
  public status!: 'pending' | 'active' | 'completed' | 'archived';
  public assignedYouths?: AssignedYouth[];

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

    // Declare static associate method
  declare static associate: (models: any) => void;

}

Job.init(
  {
    jobId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    employerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Employers',
        key: 'id'
      }
    },
    job: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organizationName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numEmployees: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    level: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    typeOfJob: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisorPosition: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    supervisorEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    supervisorPhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'active', 'completed', 'archived'),
      allowNull: false,
      defaultValue: 'pending',
    },
    assignedYouths: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'jobs',
    timestamps: true,
  }
);

// Define associations
Job.associate = (models) => {
  Job.belongsTo(models.Employer, {
    foreignKey: 'employerId',
    as: 'employer',
  });
};

export default Job;
