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
  const { title, category, description, price, quantity, imageURL } = req.body;
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
  if (!imageURL || typeof imageURL !== 'string') {
    errors.push('Поле "imageURL" обязательно и должно быть строкой');
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
    imageURL,
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

goodsController.patch('/:id', (req, res) => {
  const good = goodsStorage.find((g) => g.id === req.params.id);
  if (!good) {
    res.status(404).json({ error: 'Товар не найден' });
    return;
  }

  const { title, category, description, price, quantity, imageURL } = req.body;
  if (title !== undefined) {
    if (typeof title !== 'string') {
      res.status(400).json({ error: 'Поле "title" должно быть строкой' });
      return;
    }
    good.title = title.trim();
  }

  if (category !== undefined) {
    if (typeof category !== 'string') {
      res.status(400).json({ error: 'Поле "category" должно быть строкой' });
      return;
    }
    good.category = category.trim();
  }

  if (description !== undefined) {
    if (typeof description !== 'string') {
      res.status(400).json({ error: 'Поле "description" должно быть строкой' });
      return;
    }
    good.description = description.trim();
  }

  if (price !== undefined) {
    if (typeof price !== 'number' || price < 0) {
      res
        .status(400)
        .json({ error: 'Поле "price" должно быть неотрицательным числом' });
      return;
    }
    good.price = price;
  }

  if (quantity !== undefined) {
    if (
      typeof quantity !== 'number' ||
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {
      res.status(400).json({
        error: 'Поле "quantity" должно быть неотрицательным целым числом',
      });
      return;
    }
    good.quantity = quantity;
  }

  if (imageURL !== undefined) {
    if (typeof imageURL !== 'string') {
      res.status(400).json({ error: 'Поле "imageURL" должно быть строкой' });
      return;
    }
    good.imageURL = imageURL;
  }

  res.json(good);
});
