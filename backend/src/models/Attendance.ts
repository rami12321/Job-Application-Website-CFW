// src/models/Attendance.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

// Define the structure of each day's record
interface DayRecord {
  day: string;            // Day name (e.g., "Monday")
  date: Date | null;      // The date when the attendance was marked
  youthName: string;      // Youth name (could be used for display/verification)
  signature: string;      // Either the signature itself or a path/URL to it
  locationChecked: boolean; // Whether the location check passed for that day
  confirmed: boolean;     // Whether the youth confirmed the day's data
  accepted: boolean;      // Whether the attendance for that day was accepted
}

// Define Attendance attributes
interface AttendanceAttributes {
  id: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  days: DayRecord[]; // Array of 40 day records
}

// When creating a new attendance record, the id field is optional.
interface AttendanceCreationAttributes extends Optional<AttendanceAttributes, 'id'> {}

class Attendance extends Model<AttendanceAttributes, AttendanceCreationAttributes> implements AttendanceAttributes {
  public id!: string;
  public jobRequestId!: string;
  public employerId!: string;
  public youthId!: string;
  public days!: DayRecord[];

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Attendance.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    jobRequestId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    employerId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    youthId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    days: {
      type: DataTypes.JSON, // Stores the 40-day array as JSON
      allowNull: false,
      defaultValue: Array.from({ length: 40 }, () => ({
        day: "",
        date: null,
        youthName: "",
        signature: "",
        locationChecked: false,
        confirmed: false,
        accepted: false,
      })),
    },
  },
  {
    sequelize,
    tableName: 'attendances',
    timestamps: true,
  }
);

export default Attendance;
