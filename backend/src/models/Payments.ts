import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/database';

interface PaymentAttributes {
  id: string;
  jobRequestId: string;
  employerId: string;
  youthId: string;
  totalDaysWorked: number;
  amountPaid: number;
  paymentDate: Date;
}

interface PaymentCreationAttributes extends Optional<PaymentAttributes, 'id'> {}

class Payment extends Model<PaymentAttributes, PaymentCreationAttributes> implements PaymentAttributes {
  public id!: string;
  public jobRequestId!: string;
  public employerId!: string;
  public youthId!: string;
  public totalDaysWorked!: number;
  public amountPaid!: number;
  public paymentDate!: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Payment.init(
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
    totalDaysWorked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    amountPaid: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0.0,
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'payments',
    timestamps: true,
  }
);

export default Payment;
