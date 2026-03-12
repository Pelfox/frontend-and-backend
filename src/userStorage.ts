import type { LoginRequestDTO, RegisterRequestDTO } from './dto/auth.js';
import type { User } from './models/user.js';
import { randomUUID } from 'node:crypto';
import { compareSync, hashSync } from 'bcrypt';

const users: User[] = [];
const bcryptHashRounds = 10;

type UserAuthResult =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      user: User;
    };

export const createUser = (request: RegisterRequestDTO): UserAuthResult => {
  const existingUser = users.find((user) => user.email === request.email);
  if (existingUser) {
    return { ok: false, message: 'Пользователь уже существует.' };
  }

  const { password, ...rest } = request;
  const password_hash = hashSync(password, bcryptHashRounds);

  const user: User = {
    id: randomUUID(),
    password_hash,
    ...rest,
  };
  users.push(user);

  return { ok: true, user };
};

export const findUserById = (id: string): User | null => {
  return users.find((user) => user.id === id) ?? null;
};

export const loginUser = (request: LoginRequestDTO): UserAuthResult => {
  const existingUser = users.find((user) => user.email === request.email);
  if (!existingUser) {
    return { ok: false, message: 'Пользователь не найден.' };
  }

  const isValidPassword = compareSync(
    request.password,
    existingUser.password_hash,
  );
  if (!isValidPassword) {
    return { ok: false, message: 'Пароль некорректен.' };
  }

  return { ok: true, user: existingUser };
};
