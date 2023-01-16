import express from 'express';
import cors from 'cors';

import userRoutes from './src/routes/userRoutes.js';

import db from './src/database/db.js';

db.sync();

const app = express();

app.use(express.json({ limit: '10kb' }));

app.use(cors());

app.use('/api/users', userRoutes);

app.get('/health', async (req, res) => res.send('API ok'));

const port = 7008;

app.listen(port, () => console.log(`API rodando na porta ${port}!`));
