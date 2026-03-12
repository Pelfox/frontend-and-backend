import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

type RouterCtx = {
  path: string;
  navigate: (to: string) => void;
};

const RouterContext = createContext<RouterCtx | null>(null);

const getHashPath = (): string => {
  const hash = window.location.hash.slice(1);
  return hash || '/';
};

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [path, setPath] = useState<string>(getHashPath);

  useEffect(() => {
    const onHashChange = () => {
      setPath(getHashPath());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>');
  return ctx;
}

export function useParams(pattern: string): Record<string, string> | null {
  const { path } = useRouter();
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pp = patternParts[i];
    if (pp.startsWith(':')) {
      params[pp.slice(1)] = pathParts[i];
    } else if (pp !== pathParts[i]) {
      return null;
    }
  }
  return params;
}
