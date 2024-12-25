import express from 'express';
import cors from 'cors';
import youthRoutes from './routes/youthRoutes';  // Ensure correct path
import employerRoutes from './routes/employerRoutes';
import jobRequestsRoutes from './routes/jobRequestsRoutes';
import verificationcodeRoutes from './routes/verificationcodeRoutes';
import { deleteCode } from './controllers/VerificationCodeController';
import { updateAppliedJob } from './controllers/youthController';

const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());

// Increase the request body size limit to 50MB (you can adjust this as needed)
app.use(express.json({ limit: '50mb' }));  // Increase limit for JSON requests

// Serve static files
app.use(express.static('public'));    
// Define your routes
app.use('/youth', youthRoutes);
app.use('/employer', employerRoutes);
app.use('/job-request', jobRequestsRoutes);
app.use('/api', verificationcodeRoutes);
app.delete('/api/verificationCode/:code', deleteCode);
app.put('/youth/:id/appliedJob', updateAppliedJob);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
