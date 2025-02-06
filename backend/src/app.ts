import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize from '../config/database';
import youthRoutes from './routes/youthRoutes';
import employerRoutes from './routes/employerRoutes';
import jobRequestsRoutes from './routes/jobRequestsRoutes';
import verificationcodeRoutes from './routes/verificationcodeRoutes';
import { deleteCode } from './controllers/VerificationCodeController';
import { updateAppliedJob } from './controllers/youthController';
import Employer from './models/employer';
import Signature from './models/signature';
import Youth from './models/youth';

sequelize.sync({ alter: true }) // `force: true` will drop existing tables and recreate them
  .then(() => {
    console.log('✅ Database synced successfully!');
  })
  .catch((error) => {
    console.error('❌ Database sync error:', error);
  });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Serve static files
app.use(express.static('public'));

// Define routes
app.use('/youth', youthRoutes);
app.use('/employer', employerRoutes);
app.use('/job-request', jobRequestsRoutes);
app.use('/api', verificationcodeRoutes);
app.delete('/api/verificationCode/:code', deleteCode);
app.put('/youth/:id/appliedJob', updateAppliedJob);

// Start the server
sequelize.authenticate().then(() => {
  console.log('✅ MySQL connected');
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}).catch(err => console.error('❌ Database connection failed:', err));
