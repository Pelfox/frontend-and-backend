import type { Good } from '../good.js';
import { Router } from 'express';

// Принципиально простое хранилище для всех товаров приложения.
const goodsStorage: Good[] = [];
export const goodsController: Router = Router();

// Получить список всех товаров
goodsController.get('/', (_req, res) => {
  res.json(goodsStorage);
});

// Получить товар по ID
goodsController.get('/:id', (req, res) => {
  const good = goodsStorage.find((g) => g.id === req.params.id);

  if (!good) {
    res.status(404).json({ error: 'Товар не найден' });
    return;
  }

  res.json(good);
});

// Создать новый товар
goodsController.post('/', (req, res) => {
  const { title, category, description, price, quantity } = req.body;
  const errors: string[] = [];

  if (!title || typeof title !== 'string') {
    errors.push('Поле "title" обязательно и должно быть строкой');
  }
  if (!category || typeof category !== 'string') {
    errors.push('Поле "category" обязательно и должно быть строкой');
  }
  if (!description || typeof description !== 'string') {
    errors.push('Поле "description" обязательно и должно быть строкой');
  }
  if (typeof price !== 'number' || price < 0) {
    errors.push(
      'Поле "price" обязательно и должно быть неотрицательным числом',
    );
  }
  if (
    typeof quantity !== 'number' ||
    !Number.isInteger(quantity) ||
    quantity < 0
  ) {
    errors.push(
      'Поле "quantity" обязательно и должно быть неотрицательным целым числом',
    );
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  const good: Good = {
    id: crypto.randomUUID(),
    title: title.trim(),
    category: category.trim(),
    description: description.trim(),
    price,
    quantity,
  };

  goodsStorage.push(good);
  res.status(201).json(good);
});

// Удалить товар
goodsController.delete('/:id', (req, res) => {
  const index = goodsStorage.findIndex((g) => g.id === req.params.id);

  if (index === -1) {
    res.status(404).json({ error: 'Товар не найден' });
    return;
  }

  goodsStorage.splice(index, 1);
  res.status(204).send();
});
