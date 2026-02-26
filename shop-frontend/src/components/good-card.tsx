import { useState } from 'react';
import { useGoods } from '../hooks/use-goods';
import { Button } from './button';
import { CreateGoodDialog } from './create-good-dialog';

interface GoodCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  quantity: number;
  price: number;
  imageURL: string;

  onUpdated: () => void;
}

export function GoodCard(props: GoodCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  function deleteGood() {
    fetch(`http://localhost:3000/goods/${props.id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при удалении товара');
        }
        useGoods(-1);
      })
      .catch((error) => console.error('Ошибка при удалении товара:', error));
  }

  return (
    <>
      <CreateGoodDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={props.onUpdated}
        initialGood={props}
      />
      <div className="rounded-2xl border border-neutral-200 overflow-hidden flex flex-col justify-between">
        <div className="relative h-48 w-full overflow-hidden">
          {/* Картинка карточки товара */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={props.imageURL || 'https://placehold.co/600x400'} alt={props.title} />
          </div>

          {/* Категория товара */}
          <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-white px-3 py-1 text-xs">
            {props.category}
          </span>

          {/* Кнопка удаления */}
          <button onClick={deleteGood} className="top-3 right-3 absolute rounded-full bg-red-500 p-1 transition-colors hover:bg-red-400 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-5">
          {/* Название товара */}
          <h3 className="text-xl font-semibold">{props.title}</h3>
          {/* Описание товара */}
          <p className="flex-1 text-sm text-neutral-500">{props.description}</p>

          {/* Click-To-Action кнопка */}
          <div className="mt-3 flex flex-col items-end w-full gap-2">
            <span className="text-sm text-neutral-400">
              В наличии: {props.quantity} шт.
            </span>
            <div className="flex items-center justify-end gap-2">
              <Button>Подробнее</Button>
              <Button onClick={() => setDialogOpen(true)}>Редактировать</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
