import { useState, useEffect } from 'react';
import { fetchProducts, deleteProduct } from '../lib/api';
import { useRouter } from '../lib/router';
import type { Product } from '../lib/types';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();

  const loadProducts = async () => {
    setIsLoading(true);
    setError(null);
    const result = await fetchProducts();
    if (!result.ok) {
      setError(result.message);
      setIsLoading(false);
      return;
    }
    setProducts(result.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;

    const result = await deleteProduct(id);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Товары</h2>
        <button
          onClick={() => navigate('/products/new')}
          className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-4 py-2 rounded-lg"
        >
          Создать товар
        </button>
      </div>

      {isLoading && <p className="text-neutral-500">Загрузка...</p>}

      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && products.length === 0 && (
        <p className="text-neutral-500">Список товаров пуст.</p>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-neutral-200">
          <table className="w-full text-left">
            <thead className="bg-neutral-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-neutral-600">
                  Название
                </th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-600">
                  Категория
                </th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-600">
                  Цена
                </th>
                <th className="px-4 py-3 text-sm font-medium text-neutral-600 text-right">
                  Действия
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-neutral-200 hover:bg-neutral-50"
                >
                  <td className="px-4 py-3 text-sm">{product.title}</td>
                  <td className="px-4 py-3 text-sm">{product.category}</td>
                  <td className="px-4 py-3 text-sm">
                    {product.price.toFixed(2)} ₽
                  </td>
                  <td className="px-4 py-3 text-sm text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => navigate(`/products/${product.id}`)}
                        className="text-blue-600 hover:underline cursor-pointer text-sm"
                      >
                        Подробнее
                      </button>
                      <button
                        onClick={() => navigate(`/products/${product.id}/edit`)}
                        className="text-amber-600 hover:underline cursor-pointer text-sm"
                      >
                        Изменить
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:underline cursor-pointer text-sm"
                      >
                        Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
