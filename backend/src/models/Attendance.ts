import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface DayRecord {
  day: string;
  date: Date | null;
  youthName: string;
  signature: string;
  locationChecked: boolean;
  confirmed: boolean;
  accepted: boolean;
  employerConfirmed: boolean;
  adminChecked: boolean;
  paid: boolean; // Add this new field

}

interface AttendanceAttributes {
  id: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  days: DayRecord[];
}

interface AttendanceCreationAttributes
  extends Optional<AttendanceAttributes, 'id'> {}

class Attendance
  extends Model<AttendanceAttributes, AttendanceCreationAttributes>
  implements AttendanceAttributes
{
  public id!: string;
  public jobRequestId!: string;
  public employerId!: string;
  public youthId!: string;
  public days!: DayRecord[];

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
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: Array.from({ length: 40 }, () => ({
        day: '',
        date: null,
        youthName: '',
        signature: '',
        locationChecked: false,
        confirmed: false,
        accepted: false,
        employerConfirmed: false,
        employerSignature: '',
        adminChecked: false, // Add default value
      })),
    },
  },
  {
    sequelize,
    tableName: 'attendances',
    timestamps: true,
  }
);

export {
  Attendance,
  DayRecord,
  AttendanceAttributes,
  AttendanceCreationAttributes,
};
