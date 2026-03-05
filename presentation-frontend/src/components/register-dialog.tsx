import { useRef, useState, type SubmitEvent } from 'react';
import { Label } from './form/label';
import { Input } from './form/input';
import { register } from '../lib/api';

export function RegisterDialog() {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const openDialog = () => {
    dialogRef.current?.showModal();
  };

  const handleFormSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target);

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
      alert('Не был введён e-mail, имя, фамилия или пароль.');
      return;
    }

    setIsRegistering(true);
    const response = await register(email, firstName, lastName, password);
    if (!response.ok) {
      alert(response.message);
      setIsRegistering(false);
      return;
    }

    alert('Аккаунт зарегистрирован.');
    setIsRegistering(false);
    dialogRef.current?.close();
  };

  return (
    <>
      <dialog ref={dialogRef} className="p-6 rounded-xl shadow-xl w-96">
        <h2 className="text-lg font-semibold mb-4">Регистрация аккаунта</h2>
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
            <Label htmlFor="firstName">Имя</Label>
            <Input name="firstName" type="text" placeholder="Иван" />
          </div>
          <div>
            <Label htmlFor="lastName">Фамилия</Label>
            <Input name="lastName" type="text" placeholder="Иванов" />
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <Input name="password" type="password" />
          </div>
          <div className="mt-4">
            <button
              type="submit"
              disabled={isRegistering}
              className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer text-sm px-3 py-1.5 rounded-lg"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </dialog>

      <div>
        <button
          onClick={openDialog}
          className="bg-blue-600 hover:bg-blue-500 transition-colors text-white cursor-pointer px-4 py-1.5 rounded-lg"
        >
          Регистрация аккаунта
        </button>
      </div>
    </>
  );
}
