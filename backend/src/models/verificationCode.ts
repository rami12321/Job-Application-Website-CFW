import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

interface VerificationCodeAttributes {
  id: number;
  code: string;
}

class VerificationCode extends Model<VerificationCodeAttributes> implements VerificationCodeAttributes {
  public id!: number;
  public code!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

VerificationCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'verification_codes',
    timestamps: true,
  }
);

export default VerificationCode;
