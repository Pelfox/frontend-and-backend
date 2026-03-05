import { useUserState } from '../lib/context';
import { LoginDialog } from './login-dialog';
import { RegisterDialog } from './register-dialog';

export function UserState() {
  const { user } = useUserState();

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
    </div>
  );
}
