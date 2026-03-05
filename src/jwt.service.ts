import type { JwtPayload } from 'jsonwebtoken';
import type { User } from './models/user.js';
import { env } from 'node:process';
import jwt from 'jsonwebtoken';

const tokenLifetime = 3600; // в секундах
const tokenSecret = env.JWT_SECRET || 'this_is_a_secret';

export const createAccessToken = (user: User) => {
  return jwt.sign(
    {
      sub: user.id,
      user,
    } as JwtPayload,
    tokenSecret,
    { expiresIn: tokenLifetime },
  );
};

export const validateAccessToken = (token: string): JwtPayload | boolean => {
  try {
    const payload = jwt.verify(token, tokenSecret);
    if (!payload.sub) {
      return false;
    }
    return payload as JwtPayload;
  } catch {
    return false;
  }
};

declare global {
  // eslint-disable-next-line ts/no-namespace
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
