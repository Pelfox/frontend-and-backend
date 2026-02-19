import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from './button';
import { Dialog } from './dialog';

interface CreateGoodDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function CreateGoodDialog(props: CreateGoodDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setTitle('');
    setCategory('');
    setDescription('');
    setPrice('');
    setQuantity('');
    setError(null);
  }

  function handleClose() {
    if (!isSubmitting) {
      resetForm();
      props.onClose();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedPrice = Number.parseFloat(price);
    const parsedQuantity = Number.parseInt(quantity, 10);

    if (!title.trim()) {
      setError('Введите название товара.');
      return;
    }
    if (!category) {
      setError('Выберите категорию.');
      return;
    }
    if (!description.trim()) {
      setError('Введите описание товара.');
      return;
    }
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setError('Цена должна быть неотрицательным числом.');
      return;
    }
    if (
      Number.isNaN(parsedQuantity) ||
      parsedQuantity < 0 ||
      !Number.isInteger(parsedQuantity)
    ) {
      setError('Количество должно быть неотрицательным целым числом.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:3000/goods', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          category,
          description: description.trim(),
          price: parsedPrice,
          quantity: parsedQuantity,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || data.errors?.join(', ') || 'Не удалось создать товар',
        );
      }

      resetForm();
      props.onCreated();
      props.onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Произошла неизвестная ошибка',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClassName =
    'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900';

  const labelClassName = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <Dialog open={props.open} onClose={handleClose} title="Новый товар">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Сообщение об ошибке */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Название товара */}
        <div>
          <label htmlFor="good-title" className={labelClassName}>
            Название
          </label>
          <input
            id="good-title"
            type="text"
            placeholder="Введите название товара"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClassName}
          />
        </div>

        {/* Категория */}
        <div>
          <label htmlFor="good-category" className={labelClassName}>
            Категория
          </label>
          <input
            id="good-category"
            type="text"
            placeholder="Введите категорию товара"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClassName}
          />
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="good-description" className={labelClassName}>
            Описание
          </label>
          <textarea
            id="good-description"
            placeholder="Введите описание товара"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${inputClassName} resize-none`}
          />
        </div>

        {/* Цена и количество */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="good-price" className={labelClassName}>
              Цена, ₽
            </label>
            <input
              id="good-price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="good-quantity" className={labelClassName}>
              Количество, шт.
            </label>
            <input
              id="good-quantity"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={inputClassName}
            />
          </div>
        </div>

        {/* Действия */}
        <div className="mt-2 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50"
          >
            Отмена
          </button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Создание...' : 'Создать товар'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
