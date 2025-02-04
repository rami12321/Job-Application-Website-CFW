const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();



const sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

// Test Database Connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected successfully!'))
  .catch(err => console.error('❌ Database connection error:', err));

  module.exports = sequelize;
