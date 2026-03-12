import { useState } from 'react';
import { useUserState } from '../lib/context';
import { LoginDialog } from './login-dialog';
import { RegisterDialog } from './register-dialog';
import { logout, logoutAll } from '../lib/api';

export function UserState() {
  const { user, setUser } = useUserState();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
    setUser(null);
    setIsLoggingOut(false);
  };

  const handleLogoutAll = async () => {
    setIsLoggingOut(true);
    await logoutAll();
    setUser(null);
    setIsLoggingOut(false);
  };

  if (!user) {
    return (
      <>
        <p className="leading-relaxed tracking-tight">
          Сейчас Вы не вошли в аккаунт. Нажмите кнопку ниже для входа.
        </p>
        <div className="mt-6 flex items-center justify-start gap-2">
          <LoginDialog />
          <RegisterDialog />
        </div>
      </>
    );
  }

  return (
    <div>
      <p>
        Привет, {user.first_name} {user.last_name}!
      </p>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <div className="mt-4 flex items-center gap-2">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="bg-red-600 hover:bg-red-500 transition-colors text-white cursor-pointer px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Выход...' : 'Выйти'}
        </button>
        <button
          onClick={handleLogoutAll}
          disabled={isLoggingOut}
          className="bg-red-800 hover:bg-red-700 transition-colors text-white cursor-pointer px-4 py-1.5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? 'Выход...' : 'Выйти со всех устройств'}
        </button>
      </div>
    </div>
  );
}
