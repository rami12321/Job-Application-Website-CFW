import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface AdminAttributes {
  id: string;
  active: boolean;
  fullNameEnglish: string;
  fullNameArabic: string;
  personalEmail: string;
  organizationEmail: string;
  position: string;
  area: string;
  phoneNumber: string;
  role: 'admin';
}

interface AdminCreationAttributes extends Optional<AdminAttributes, 'id'> {}

class Admin extends Model<AdminAttributes, AdminCreationAttributes> implements AdminAttributes {
  public id!: string;
  public active!: boolean;
  public fullNameEnglish!: string;
  public fullNameArabic!: string;
  public personalEmail!: string;
  public organizationEmail!: string;
  public position!: string;
  public area!: string;
  public phoneNumber!: string;
  public role!: 'admin';

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Admin.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    fullNameEnglish: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fullNameArabic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    personalEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    organizationEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'admin'
    }
  },
  {
    sequelize,
    tableName: 'admins',
    timestamps: true,
  }
);

export default Admin;
