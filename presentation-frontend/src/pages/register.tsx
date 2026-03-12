import { useState, type FormEvent } from 'react';
import { Label } from '../components/form/label';
import { Input } from '../components/form/input';
import { register } from '../lib/api';
import { useRouter } from '../lib/router';

export function RegisterPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const { navigate } = useRouter();

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const email = data.get('email');
    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const password = data.get('password');

    if (
      !email ||
      typeof email !== 'string' ||
      !firstName ||
      typeof firstName !== 'string' ||
      !lastName ||
      typeof lastName !== 'string' ||
      !password ||
      typeof password !== 'string'
    ) {
      alert('Не все поля были заполнены.');
      return;
    }

    setIsRegistering(true);
    const response = await register(email, firstName, lastName, password);
    if (!response.ok) {
      alert(response.message);
      setIsRegistering(false);
      return;
    }

    setIsRegistering(false);
    alert('Аккаунт зарегистрирован. Теперь вы можете войти.');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6">Регистрация аккаунта</h1>
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
            <Label htmlFor="firstName">Имя</Label>
            <Input name="firstName" type="text" placeholder="Иван" required />
          </div>
          <div>
            <Label htmlFor="lastName">Фамилия</Label>
            <Input name="lastName" type="text" placeholder="Иванов" required />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input name="password" type="password" required />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={isRegistering}
              className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-5 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline text-sm cursor-pointer"
            >
              Уже есть аккаунт? Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
