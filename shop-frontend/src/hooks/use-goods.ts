import { useEffect, useState } from 'react';

export interface FetchedGood {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
  quantity: number;
  imageURL: string;
}

export function useGoods(refreshKey: number = 0) {
  const [goods, setGoods] = useState<FetchedGood[]>([]);

  useEffect(() => {
    async function fetchGoods() {
      try {
        const response = await fetch('http://localhost:3000/goods', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        });
        setGoods(await response.json());
      } catch (error) {
        console.error('Ошибка при загрузке товаров:', error);
      }
    }

    fetchGoods();
  }, [refreshKey]);

  return goods;
}
