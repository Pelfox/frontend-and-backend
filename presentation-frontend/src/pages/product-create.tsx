import { useState, type FormEvent } from 'react';
import { Label } from '../components/form/label';
import { Input } from '../components/form/input';
import { createProduct } from '../lib/api';
import { useRouter } from '../lib/router';

export function ProductCreatePage() {
  const [isCreating, setIsCreating] = useState(false);
  const { navigate } = useRouter();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    setIsCreating(true);
    const result = await createProduct({ title, category, description, price });
    if (!result.ok) {
      alert(result.message);
      setIsCreating(false);
      return;
    }

    setIsCreating(false);
    navigate(`/products/${result.data.id}`);
  };

  return (
    <div>
      <button
        onClick={() => navigate('/products')}
        className="text-blue-600 hover:underline cursor-pointer text-sm mb-6 inline-block"
      >
        Вернуться к списку
      </button>

      <div className="bg-white rounded-xl border border-neutral-200 p-6 max-w-lg">
        <h2 className="text-2xl font-semibold mb-6">Создание товара</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Название</Label>
            <Input
              name="title"
              type="text"
              placeholder="Название товара"
              required
            />
          </div>
          <div>
            <Label htmlFor="category">Категория</Label>
            <Input
              name="category"
              type="text"
              placeholder="Категория"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Описание</Label>
            <Input
              name="description"
              type="text"
              placeholder="Описание товара"
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Цена</Label>
            <Input name="price" type="text" placeholder="100.00" required />
          </div>
          <div className="pt-2">
            <button
              type="submit"
              disabled={isCreating}
              className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Создание...' : 'Создать товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
