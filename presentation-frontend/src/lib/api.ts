import type { LoggedUser, Product } from './types';

export type RequestResult<T> =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      data: T;
    };

type RefreshResponse = {
  access_token: string;
  refresh_token: string;
};

const getStoredUser = (): LoggedUser | null => {
  const raw = localStorage.getItem('userState');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LoggedUser;
  } catch {
    return null;
  }
};

const updateStoredTokens = (
  accessToken: string,
  refreshToken: string,
): void => {
  const user = getStoredUser();
  if (!user) return;
  user.access_token = accessToken;
  user.refresh_token = refreshToken;
  localStorage.setItem('userState', JSON.stringify(user));
};

const clearStoredUser = (): void => {
  localStorage.removeItem('userState');
};

let refreshPromise: Promise<RefreshResponse | null> | null = null;

const doRefresh = async (): Promise<RefreshResponse | null> => {
  const user = getStoredUser();
  if (!user?.refresh_token) return null;

  try {
    const response = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ refresh_token: user.refresh_token }),
    });

    if (!response.ok) {
      clearStoredUser();
      return null;
    }

    const data = (await response.json()) as RefreshResponse;
    updateStoredTokens(data.access_token, data.refresh_token);
    return data;
  } catch {
    return null;
  }
};

const refreshTokens = async (): Promise<RefreshResponse | null> => {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
};

const makeRequest = async <T>(
  method: string,
  endpoint: string,
  data?: unknown,
  initialHeaders?: Record<string, string>,
  _retried = false,
): Promise<RequestResult<T>> => {
  let body: string | undefined = undefined;
  const headers: Record<string, string> = initialHeaders
    ? { ...initialHeaders }
    : { Accept: 'application/json' };

  if (data) {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  if (!headers['Authorization']) {
    const user = getStoredUser();
    if (user?.access_token) {
      headers['Authorization'] = `Bearer ${user.access_token}`;
    }
  }

  const response = await fetch(`http://localhost:3000/${endpoint}`, {
    method,
    body,
    headers,
  });

  if (response.status === 401 && !_retried) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${refreshed.access_token}`;
      return makeRequest<T>(method, endpoint, data, headers, true);
    }

    clearStoredUser();
    return {
      ok: false,
      message: 'Сессия истекла. Пожалуйста, войдите заново.',
    };
  }

  if (response.status === 204) {
    return {
      ok: true,
      data: {} as T,
    };
  }

  let responseBody;
  try {
    responseBody = await response.json();
  } catch (e) {
    console.error('Failed to parse response body:', e);
    return { ok: false, message: 'Не удаётся распарсить ответ сервера.' };
  }

  if (!response.ok) {
    return {
      ok: false,
      message: responseBody.message ?? 'Неизвестная ошибка.',
    };
  }

  return {
    ok: true,
    data: responseBody as T,
  };
};

export const login = async (email: string, password: string) => {
  return makeRequest<LoggedUser>('POST', 'api/auth/login', {
    email,
    password,
  });
};

export const register = async (
  email: string,
  firstName: string,
  lastName: string,
  password: string,
) => {
  return makeRequest<LoggedUser>('POST', 'api/auth/register', {
    email,
    first_name: firstName,
    last_name: lastName,
    password,
  });
};

export const logout = async (): Promise<RequestResult<{ message: string }>> => {
  const user = getStoredUser();
  if (!user?.refresh_token) {
    clearStoredUser();
    return { ok: true, data: { message: 'Выход выполнен успешно.' } };
  }

  const result = await makeRequest<{ message: string }>(
    'POST',
    'api/auth/logout',
    { refresh_token: user.refresh_token },
  );

  clearStoredUser();
  return result;
};

export const logoutAll = async (): Promise<
  RequestResult<{ message: string }>
> => {
  const result = await makeRequest<{ message: string }>(
    'POST',
    'api/auth/logout-all',
  );

  clearStoredUser();
  return result;
};

export const fetchProducts = async (): Promise<RequestResult<Product[]>> => {
  return makeRequest<Product[]>('GET', 'api/products');
};

export const fetchProductById = async (
  id: string,
): Promise<RequestResult<Product>> => {
  return makeRequest<Product>('GET', `api/products/${id}`);
};

export const createProduct = async (product: {
  title: string;
  category: string;
  description: string;
  price: string;
}): Promise<RequestResult<Product>> => {
  return makeRequest<Product>('POST', 'api/products', product);
};

export const updateProduct = async (
  id: string,
  product: {
    title?: string;
    category?: string;
    description?: string;
    price?: string;
  },
): Promise<RequestResult<Product>> => {
  return makeRequest<Product>('PUT', `api/products/${id}`, product);
};

export const deleteProduct = async (
  id: string,
): Promise<RequestResult<Record<string, never>>> => {
  return makeRequest<Record<string, never>>('DELETE', `api/products/${id}`);
};
