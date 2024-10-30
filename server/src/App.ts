import express from 'express';
import bodyParser from 'body-parser';
import initRoutes from './routes';

const app = express();
app.use(bodyParser.json());
app.use('/api', initRoutes);

export default app;