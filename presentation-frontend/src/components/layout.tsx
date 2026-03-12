import { useState, type ReactNode } from 'react';
import { useUserState } from '../lib/context';
import { useRouter } from '../lib/router';
import { logout } from '../lib/api';

export function Layout({ children }: { children: ReactNode }) {
  const { user, setUser } = useUserState();
  const { navigate } = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setUser(null);
    setIsLoggingOut(false);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b border-neutral-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/products')}
              className="text-lg font-semibold text-neutral-800 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Магазин
            </button>
            <nav className="flex items-center gap-4">
              <button
                onClick={() => navigate('/products')}
                className="text-sm text-neutral-600 hover:text-blue-600 transition-colors cursor-pointer"
              >
                Товары
              </button>
            </nav>
          </div>
          {user && (
            <div className="flex items-center gap-4">
              <span className="text-sm text-neutral-600">
                {user.first_name} {user.last_name}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="bg-red-600 hover:bg-red-500 transition-colors text-white cursor-pointer px-3 py-1.5 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoggingOut ? 'Выход...' : 'Выйти'}
              </button>
            </div>
          )}
        </div>
      </header>
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
