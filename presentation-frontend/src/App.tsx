import { useUserState } from './lib/context';
import { useRouter, useParams } from './lib/router';
import { Layout } from './components/layout';
import { LoginPage } from './pages/login';
import { RegisterPage } from './pages/register';
import { ProductsPage } from './pages/products';
import { ProductDetailPage } from './pages/product-detail';
import { ProductCreatePage } from './pages/product-create';
import { ProductEditPage } from './pages/product-edit';
import { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUserState();
  const { navigate } = useRouter();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null;

  return <>{children}</>;
}

function GuestGuard({ children }: { children: React.ReactNode }) {
  const { user } = useUserState();
  const { navigate } = useRouter();

  useEffect(() => {
    if (user) {
      navigate('/products');
    }
  }, [user, navigate]);

  if (user) return null;

  return <>{children}</>;
}

function ProductEditRoute() {
  const params = useParams('/products/:id/edit');
  if (!params) return null;
  return <ProductEditPage />;
}

function ProductDetailRoute() {
  const editParams = useParams('/products/:id/edit');
  const detailParams = useParams('/products/:id');
  if (editParams) return null;
  if (!detailParams) return null;
  return <ProductDetailPage />;
}

function Router() {
  const { path } = useRouter();

  if (path === '/login' || path === '/') {
    return (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    );
  }

  if (path === '/register') {
    return (
      <GuestGuard>
        <RegisterPage />
      </GuestGuard>
    );
  }

  if (path === '/products') {
    return (
      <AuthGuard>
        <Layout>
          <ProductsPage />
        </Layout>
      </AuthGuard>
    );
  }

  if (path === '/products/new') {
    return (
      <AuthGuard>
        <Layout>
          <ProductCreatePage />
        </Layout>
      </AuthGuard>
    );
  }

  if (path.match(/^\/products\/[^/]+\/edit$/)) {
    return (
      <AuthGuard>
        <Layout>
          <ProductEditRoute />
        </Layout>
      </AuthGuard>
    );
  }

  if (path.match(/^\/products\/[^/]+$/)) {
    return (
      <AuthGuard>
        <Layout>
          <ProductDetailRoute />
        </Layout>
      </AuthGuard>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-neutral-800 mb-2">404</h1>
        <p className="text-neutral-500 mb-4">Страница не найдена.</p>
        <a href="#/products" className="text-blue-600 hover:underline text-sm">
          ← На главную
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return <Router />;
}
