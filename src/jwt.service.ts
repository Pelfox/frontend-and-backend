import type { JwtPayload } from 'jsonwebtoken';
import type { User } from './models/user.js';
import { env } from 'node:process';
import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';

const accessTokenLifetime = 10; // 15 минут (в секундах)
const refreshTokenLifetime = 604800; // 7 дней (в секундах)

const accessTokenSecret = env.JWT_ACCESS_SECRET || 'this_is_a_secret';
const refreshTokenSecret = env.JWT_REFRESH_SECRET || 'this_is_a_refresh_secret';

interface StoredRefreshToken {
  userId: string;
  token: string;
  expiresAt: number;
}

const refreshTokens = new Map<string, StoredRefreshToken>();

export const createAccessToken = (user: User): string => {
  return jwt.sign(
    {
      sub: user.id,
      user,
    } as JwtPayload,
    accessTokenSecret,
    { expiresIn: accessTokenLifetime },
  );
};

export const validateAccessToken = (token: string): JwtPayload | false => {
  try {
    const payload = jwt.verify(token, accessTokenSecret);
    if (!payload.sub) {
      return false;
    }
    return payload as JwtPayload;
  } catch {
    return false;
  }
};

export const createRefreshToken = (user: User): string => {
  const tokenId = randomUUID();

  const token = jwt.sign(
    {
      sub: user.id,
      jti: tokenId,
    } as JwtPayload,
    refreshTokenSecret,
    { expiresIn: refreshTokenLifetime },
  );

  refreshTokens.set(tokenId, {
    userId: user.id,
    token,
    expiresAt: Date.now() + refreshTokenLifetime * 1000,
  });

  return token;
};

export const validateRefreshToken = (token: string): JwtPayload | false => {
  try {
    const payload = jwt.verify(token, refreshTokenSecret) as JwtPayload;
    if (!payload.sub || !payload.jti) {
      return false;
    }

    const stored = refreshTokens.get(payload.jti);
    if (!stored) {
      return false;
    }

    if (stored.token !== token) {
      return false;
    }

    if (stored.expiresAt < Date.now()) {
      refreshTokens.delete(payload.jti);
      return false;
    }

    return payload;
  } catch {
    return false;
  }
};

export const revokeRefreshToken = (token: string): boolean => {
  try {
    const payload = jwt.decode(token) as JwtPayload | null;
    if (!payload?.jti) {
      return false;
    }

    return refreshTokens.delete(payload.jti);
  } catch {
    return false;
  }
};

export const revokeAllUserRefreshTokens = (userId: string): void => {
  for (const [tokenId, stored] of refreshTokens.entries()) {
    if (stored.userId === userId) {
      refreshTokens.delete(tokenId);
    }
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
