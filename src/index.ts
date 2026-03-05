import express from 'express';
import { authRouter } from './routers/auth.js';
import { productsRouter } from './routers/products.js';

const app = express();

app.use(express.json());
app.use('/api/auth/', authRouter);
app.use('/api/products', productsRouter);

app.listen('3000', () => {
  console.log('Сервер запущен на :3000.');
});
