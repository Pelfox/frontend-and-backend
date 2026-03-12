import { useState, useEffect } from 'react';
import { fetchProductById, deleteProduct } from '../lib/api';
import { useRouter, useParams } from '../lib/router';
import type { Product } from '../lib/types';

export function ProductDetailPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();
  const params = useParams('/products/:id');

  const productId = params?.id;

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setIsLoading(true);
      setError(null);
      const result = await fetchProductById(productId);
      if (!result.ok) {
        setError(result.message);
        setIsLoading(false);
        return;
      }
      setProduct(result.data);
      setIsLoading(false);
    };

    load();
  }, [productId]);

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const result = await deleteProduct(productId);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    navigate('/products');
  };

  if (!productId) {
    return <p className="text-red-600">Некорректный идентификатор товара.</p>;
  }

  if (isLoading) {
    return <p className="text-neutral-500">Загрузка...</p>;
  }

  if (error) {
    return (
      <div>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/products')}
          className="text-blue-600 hover:underline cursor-pointer text-sm"
        >
          Вернуться к списку
        </button>
      </div>
    );
  }

  if (!product) {
    return <p className="text-neutral-500">Товар не найден.</p>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 hover:underline cursor-pointer text-sm mb-6 inline-block"
      >
        Вернуться к списку
      </button>

      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h2 className="text-2xl font-semibold mb-4">{product.title}</h2>

        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-neutral-500">ID</span>
            <p className="text-sm text-neutral-800 font-mono">{product.id}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-500">
              Категория
            </span>
            <p className="text-sm text-neutral-800">{product.category}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-500">
              Описание
            </span>
            <p className="text-sm text-neutral-800">{product.description}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-neutral-500">Цена</span>
            <p className="text-sm text-neutral-800">
              {product.price.toFixed(2)} ₽
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-200">
          <button
            onClick={() => navigate(`/products/${product.id}/edit`)}
            className="bg-amber-500 hover:bg-amber-400 transition-colors text-white cursor-pointer px-4 py-2 rounded-lg text-sm"
          >
            Редактировать
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-500 transition-colors text-white cursor-pointer px-4 py-2 rounded-lg text-sm"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
}
