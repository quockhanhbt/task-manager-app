import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import tasksRouter from './routes/tasks.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
