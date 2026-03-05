import { UserState } from './components/user-state';

export default function App() {
  return (
    <div className="container mx-auto py-12 px-16">
      <h1 className="text-3xl font-semibold">Презентация авторизации</h1>
      <div className="mt-3">
        <UserState />
      </div>
    </div>
  );
}
