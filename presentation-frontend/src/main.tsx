import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './main.css';
import { UserProvider } from './lib/context.tsx';
import { RouterProvider } from './lib/router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider>
        <App />
      </RouterProvider>
    </UserProvider>
  </StrictMode>,
);
