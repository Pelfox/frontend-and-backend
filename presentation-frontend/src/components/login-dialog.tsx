import { useRef, useState, type SubmitEvent } from 'react';
import { Label } from './form/label';
import { Input } from './form/input';
import { login } from '../lib/api';
import { useUserState } from '../lib/context';

export function LoginDialog() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setUser } = useUserState();

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
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
    alert('Вход в аккаунт выполнен!');
    setUser(response.data);
    dialogRef.current?.close();
  };

  return (
    <>
      <dialog ref={dialogRef} className="p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Вход в аккаунт</h2>
        <form onSubmit={handleFormSubmit} className="space-y-2">
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input
              name="email"
              type="email"
              placeholder="someone@example.com"
            />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input name="password" type="password" />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isLoggingIn}
              className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer text-sm px-3 py-1.5 rounded-lg"
            >
              Авторизоваться
            </button>
          </div>
        </form>
      </dialog>

      <div>
        <button
          onClick={openDialog}
          className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-4 py-1.5 rounded-lg"
        >
          Войти в аккаунт
        </button>
      </div>
    </>
  );
}
