import type { NextFunction, Request, Response } from 'express';
import type { User } from './models/user.js';
import { validateAccessToken } from './jwt.service.js';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const header = req.header('Authorization');
  if (!header || !header.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Требуется передать заголовок с токеном.' });
  }

  const token = header.replace('Bearer ', '').trim();
  const validationResult = validateAccessToken(token);

  if (!validationResult) {
    return res.status(401).json({ message: 'Невалидный токен' });
  }

  req.user = (validationResult as { user: User }).user;
  next();
};
