import { useCallback, useState } from 'react';
import { Button } from './components/button';
import { CreateGoodDialog } from './components/create-good-dialog';
import { GoodCard } from './components/good-card';
import { useGoods } from './hooks/use-goods';

export default function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const goods = useGoods(refreshKey);

  const handleGoodCreated = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return (
    <div className="w-full h-screen flex flex-col gap-8">
      <header className="w-full border-b border-neutral-300">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <span className="text-xl font-semibold">Интернет-магазин</span>
          <Button onClick={() => setDialogOpen(true)}>Создать товар</Button>
        </div>
      </header>
      <section className="w-full container mx-auto px-6">
        <h2 className="text-2xl font-semibold">Доступные товары</h2>
        <div className="grid grid-cols-4 gap-6 mt-6">
          {goods.map((good) => (
            <GoodCard key={good.id} {...good} />
          ))}
        </div>
      </section>

      <CreateGoodDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleGoodCreated}
      />
    </div>
  );
}
