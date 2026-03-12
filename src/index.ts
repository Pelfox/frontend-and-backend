import express from 'express';
import { authRouter } from './routers/auth.js';
import { productsRouter } from './routers/products.js';

const app = express();

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Accept',
  );

  if (_req.method === 'OPTIONS') {
    return res.status(204).send();
  }

  next();
});

app.use(express.json());
app.use('/api/auth/', authRouter);
app.use('/api/products', productsRouter);

app.listen('3000', () => {
  console.log('Сервер запущен на :3000.');
});
