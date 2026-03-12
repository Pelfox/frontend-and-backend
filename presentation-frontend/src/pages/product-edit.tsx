import { useState, useEffect, type FormEvent } from 'react';
import { Label } from '../components/form/label';
import { Input } from '../components/form/input';
import { fetchProductById, updateProduct } from '../lib/api';
import { useRouter, useParams } from '../lib/router';
import type { Product } from '../lib/types';

export function ProductEditPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { navigate } = useRouter();
  const params = useParams('/products/:id/edit');

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

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!productId) return;

    const data = new FormData(event.currentTarget);

    const title = data.get('title');
    const category = data.get('category');
    const description = data.get('description');
    const price = data.get('price');

    if (
      !title ||
      typeof title !== 'string' ||
      !category ||
      typeof category !== 'string' ||
      !description ||
      typeof description !== 'string' ||
      !price ||
      typeof price !== 'string'
    ) {
      alert('Не все поля были заполнены.');
      return;
    }

    setIsSaving(true);
    const result = await updateProduct(productId, {
      title,
      category,
      description,
      price,
    });
    if (!result.ok) {
      alert(result.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    navigate(`/products/${productId}`);
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
        onClick={() => navigate(`/products/${productId}`)}
        className="text-blue-600 hover:underline cursor-pointer text-sm mb-6 inline-block"
      >
        Вернуться к товару
      </button>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Редактирование товара</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название</Label>
            <Input
              name="title"
              type="text"
              defaultValue={product.title}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Категория</Label>
            <Input
              name="category"
              type="text"
              defaultValue={product.category}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Input
              name="description"
              type="text"
              defaultValue={product.description}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Цена</Label>
            <Input
              name="price"
              type="text"
              defaultValue={String(product.price)}
              required
            />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-amber-500 hover:bg-amber-400 transition-colors text-white cursor-pointer px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
