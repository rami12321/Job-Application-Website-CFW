import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface EmployerAttributes {
  id: string;
  active: boolean;
  username: string;
  password: string;
  organization: string;
  fullNameEnglish: string;
  fullNameArabic: string;
  mobilePhone: string;
  whatsappNumber?: string;
  email: string;
  area: string;
  signature?: string;
  profileImage?: string;
  role?:'employer';
  latitude?: number;    // New field for latitude
  longitude?: number;
}

interface EmployerCreationAttributes extends Optional<EmployerAttributes, 'id'> {}

class Employer extends Model<EmployerAttributes, EmployerCreationAttributes> implements EmployerAttributes {
  public id!: string;
  public active!: boolean;
  public username!: string;
  public password!: string;
  public organization!: string;
  public fullNameEnglish!: string;
  public fullNameArabic!: string;
  public mobilePhone!: string;
  public whatsappNumber?: string;
  public email!: string;
  public area!: string;
  public signature?: string;
  public profileImage?: string;
  public role?:'employer';
  public latitude?: number;    // New field for latitude
  public longitude?: number;
  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Employer.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUIDs
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    organization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullNameArabic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobilePhone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    whatsappNumber: {
      type: DataTypes.STRING,
      allowNull: true,
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
    signature: {
      type: DataTypes.STRING,
      allowNull: true,

    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'employers',
    timestamps: true,
  }
);

export default Employer;
