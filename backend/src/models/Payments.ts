import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';
import { Attendance } from './Attendance';

interface DayPaymentInfo {
  dayIndex: number;
  date: Date;
  amount: number;
}

interface PaymentAttributes {
  id: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  totalDaysWorked: number;
  amountPaid: number;
  paymentDate: Date;
  verificationStatus: 'pending' | 'admin-verified' | 'rejected';
  paidDaysIndices: number[];
  paidDaysDetails?: DayPaymentInfo[]; // Optional detailed payment info
  attendanceId?: string; // Reference to the attendance record
}

interface PaymentCreationAttributes
  extends Optional<
    PaymentAttributes,
    'id' | 'paidDaysDetails' | 'attendanceId'
  > {}

class Payment
  extends Model<PaymentAttributes, PaymentCreationAttributes>
  implements PaymentAttributes
{
  public id!: string;
  public jobRequestId!: string;
  public employerId!: string;
  public youthId!: string;
  public totalDaysWorked!: number;
  public amountPaid!: number;
  public paymentDate!: Date;
  public verificationStatus!: 'pending' | 'admin-verified' | 'rejected';
  public paidDaysIndices!: number[];
  public paidDaysDetails?: DayPaymentInfo[];
  public attendanceId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    jobRequestId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    employerId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    youthId: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    totalDaysWorked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2), // Better than FLOAT for monetary values
      allowNull: false,
      defaultValue: 0.0,
      validate: {
        min: 0,
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    verificationStatus: {
      type: DataTypes.ENUM('pending', 'admin-verified', 'rejected'),
      allowNull: false,
      defaultValue: 'admin-verified',
    },
    // In your Payment model definition
    paidDaysIndices: {
      type: DataTypes.JSON, // Changed from ARRAY(INTEGER)
      allowNull: true,
      validate: {
        isValidIndices(value: number[] | null) {
          if (value && value.some((index) => index < 0 || index >= 40)) {
            throw new Error('Day indices must be between 0 and 39');
          }
        },
      },
    },
    paidDaysDetails: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    attendanceId: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: Attendance,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
    indexes: [
      {
        fields: ['youthId'],
      },
      {
        fields: ['jobRequestId'],
      },
      {
        fields: ['employerId'],
      },
      {
        fields: ['paymentDate'],
      },
      {
        fields: ['verificationStatus'],
      },
    ],
    hooks: {
      beforeValidate: (payment) => {
        // Ensure paidDaysIndices is sorted and unique
        if (payment.paidDaysIndices) {
          payment.paidDaysIndices = [...new Set(payment.paidDaysIndices)].sort(
            (a, b) => a - b
          );
        }
      },
    },
  }
);

// Set up association
Payment.belongsTo(Attendance, {
  foreignKey: 'attendanceId',
  as: 'attendance',
});

export default Payment;
