import { DataTypes, Model } from 'sequelize';
import sequelize from '../../config/database';

interface SignatureAttributes {
  id: string;
  employerId: string;
  signatureImage: string;
}

class Signature extends Model<SignatureAttributes> implements SignatureAttributes {
  public id!: string;
  public employerId!: string;
  public signatureImage!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Signature.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    employerId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Employers', // References the `Employers` table
        key: 'id', // References the `id` column in `Employers`
      },
    },
    signatureImage: {
      type: DataTypes.TEXT, // Use TEXT for large base64 strings
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Signatures', // Explicitly define the table name
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

export default Signature;
