import { useState, type FormEvent } from 'react';
import { Label } from '../components/form/label';
import { Input } from '../components/form/input';
import { login } from '../lib/api';
import { useUserState } from '../lib/context';
import { useRouter } from '../lib/router';

export function LoginPage() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setUser } = useUserState();
  const { navigate } = useRouter();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const password = data.get('password');

    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      alert('Не был введён e-mail или пароль.');
      return;
    }

    setIsLoggingIn(true);
    const response = await login(email, password);
    if (!response.ok) {
      alert(response.message);
      setIsLoggingIn(false);
      return;
    }

    setIsLoggingIn(false);
    setUser(response.data);
    navigate('/products');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Вход в аккаунт</h1>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              name="email"
              type="email"
              placeholder="someone@example.com"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input name="password" type="password" required />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingIn ? 'Вход...' : 'Войти'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              Нет аккаунта? Регистрация
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
