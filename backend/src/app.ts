import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import youthRoutes from './routes/youthRoutes';  // Ensure correct path
import employerRoutes from './routes/employerRoutes'
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use('/youth', youthRoutes);
app.use('/employer', employerRoutes);


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
