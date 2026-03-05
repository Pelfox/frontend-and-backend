import type { LoggedUser } from './types';

type RequestResult<T> =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      data: T;
    };

const makeRequest = async <T>(
  method: string,
  endpoint: string,
  data?: unknown,
  initialHeaders?: Record<string, string>,
): Promise<RequestResult<T>> => {
  let body: string | undefined = undefined;
  const headers = initialHeaders ?? { Accept: 'application/json' };

  if (data) {
    body = JSON.stringify(data);
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`http://localhost:3000/${endpoint}`, {
    method,
    body,
    headers,
  });

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
