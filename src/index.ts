import type { Request } from 'express';
import type { Good } from './good.js';
import express from 'express';

const app = express();
app.use(express.json());

// Утилита для проверки валидности запроса на добавление или обновление товара.
const validateGoodRequest = (req: Request): Good | null => {
  const body = req.body;
  if (!body) {
    return null;
  }

  const { id, name, price } = body;
  // проверяем, что все необходимые поля предоставлены, и что они корректны
  if (!id || !name || !price || Number.isNaN(price)) {
    return null;
  }

  return { id, name, price };
};

// Принципиально простое хранилище для всех товаров приложения.
const goodsStorage: Good[] = [];

// Endpoint для всех сохранённых товаров в хранилище.
app.get('/', (req, res) => {
  res.status(200).json(goodsStorage);
});

// Endpoint для получения товара по его ID.
app.get('/:id', (req, res) => {
  const { id } = req.params;
  const good = goodsStorage.find((user) => user.id === id);

  if (!good) {
    return res.status(404).json({ message: 'Товар с данным ID не найден.' });
  }

  return res.status(200).json(good);
});

// Endpoint для сохранения товара в хранилище.
app.post('/', (req, res) => {
  const good = validateGoodRequest(req);
  if (!good) {
    return res
      .status(400)
      .json({ message: 'Пожалуйста, предоставьте id, name и price товара.' });
  }

  // проверяем, не существует ли такого товара с этим ID или названием
  const existingGood = goodsStorage.find((g) => g.id === good.id);
  if (existingGood) {
    return res
      .status(400)
      .json({ message: 'Товар с данным ID уже существует.' });
  }

  goodsStorage.push(good);
  return res.status(201).json(good);
});

// Endpoint для обновления товара в хранилище.
app.patch('/:id', (req, res) => {
  const good = validateGoodRequest(req, res);
  if (!good) {
    return res
      .status(400)
      .json({ message: 'Пожалуйста, предоставьте id, name и price товара.' });
  }

  // проверяем, существует такой товар с этим ID или названием
  const existingGood = goodsStorage.find((g) => g.id === good.id);
  if (!existingGood) {
    return res.status(404).json({ message: 'Такой товар не найден.' });
  }

  return res.status(200).json(good);
});

// Endpoint для обновления товара в хранилище.
app.delete('/:id', (req, res) => {
  const { id } = req.params;

  // проверяем, существует такой товар с этим ID или названием
  const goodIndex = goodsStorage.findIndex((g) => g.id === id);
  if (goodIndex === -1) {
    return res.status(404).json({ message: 'Такой товар не найден.' });
  }

  goodsStorage.splice(goodIndex, 1);
  return res.status(204).send();
});

app.listen(3000, () => {
  console.log('Сервер запущен на порту 3000');
});
