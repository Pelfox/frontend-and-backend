import cors from 'cors';
import express from 'express';
import { goodsController } from './controllers/goods.controller.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/goods', goodsController);

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
