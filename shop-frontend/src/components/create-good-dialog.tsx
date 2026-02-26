import type { FormEvent } from 'react';
import type { FetchedGood } from '../hooks/use-goods';
import { useState } from 'react';
import { Button } from './button';
import { Dialog } from './dialog';

interface CreateGoodDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  initialGood?: FetchedGood;
}

export function CreateGoodDialog(props: CreateGoodDialogProps) {
  const [title, setTitle] = useState(props.initialGood?.title ?? '');
  const [category, setCategory] = useState(props.initialGood?.category ?? '');
  const [description, setDescription] = useState(props.initialGood?.description ?? '');
  const [price, setPrice] = useState(props.initialGood?.price.toString() ?? '');
  const [quantity, setQuantity] = useState(props.initialGood?.quantity.toString() ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string>(props.initialGood?.imageURL ?? '');

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
    if (
      !imageURL
    ) {
      setError('Количество должно быть неотрицательным целым числом.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:3000/goods${props.initialGood ? `/${props.initialGood.id}` : ''}`, {
        method: props.initialGood ? 'PATCH' : 'POST',
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
          imageURL,
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

  function handleDelete() {
    setIsSubmitting(true);
    fetch(`http://localhost:3000/goods/${props.initialGood?.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении товара');
        }
        props.onCreated();
        props.onClose();
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Произошла неизвестная ошибка');
        setIsSubmitting(false);
      });
  }

  const inputClassName =
    'w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-colors focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900';

  const labelClassName = 'block text-sm font-medium text-neutral-700 mb-1.5';

  return (
    <Dialog open={props.open} onClose={handleClose} title="Новый товар">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:gap-4">
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
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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

        {/* Изображение */}
        <div>
          <label htmlFor="good-image" className={labelClassName}>
            Изображение
          </label>
          <input
            id="good-image"
            placeholder="Введите ссылку на изображение товара"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            className={inputClassName}
          />
        </div>
        {/* Действия */}
        <div className="mt-2 flex flex-col-reverse gap-2 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 disabled:opacity-50 w-full sm:w-auto"
          >
            Отмена
          </button>
          <Button type="submit" disabled={isSubmitting}>
            {props.initialGood ? (isSubmitting ? 'Редактирование...' : 'Редактировать') : (isSubmitting ? 'Создание...' : 'Создать товар')}
          </Button>
          {props.initialGood && (
            <Button type="button" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting ? 'Удаление...' : 'Удалить товар'}
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
