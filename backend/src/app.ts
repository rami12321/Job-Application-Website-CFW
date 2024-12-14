import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import youthRoutes from './routes/youthRoutes';  // Ensure correct path
import employerRoutes from './routes/employerRoutes';
import jobRequestsRoutes from './routes/jobRequestsRoutes';
import verificationcodeRoutes from './routes/verificationcodeRoutes';
import { deleteCode } from './controllers/VerificationCodeController';

const app = express();
const PORT = 3000;



app.use(cors());

app.use(express.json()); // For parsing JSON request bodies
app.use(express.static('public'));    // Serve static files
app.use(jobRequestsRoutes);
app.use(bodyParser.json());
app.use('/youth', youthRoutes);
app.use('/employer', employerRoutes);
app.use('/job-request',jobRequestsRoutes);
app.use('/api', verificationcodeRoutes);
app.delete('/api/verificationCode/:code', deleteCode);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
