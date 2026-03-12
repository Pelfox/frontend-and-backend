import type {
  LoginRequestDTO,
  LoginResponseDTO,
  LogoutRequestDTO,
  RefreshRequestDTO,
  RefreshResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from '../dto/index.js';
import { Router } from 'express';
import { authMiddleware } from '../auth.middleware.js';
import { validateRequestBody } from '../dto/index.js';
import {
  createAccessToken,
  createRefreshToken,
  revokeAllUserRefreshTokens,
  revokeRefreshToken,
  validateRefreshToken,
} from '../jwt.service.js';
import { createUser, loginUser, findUserById } from '../userStorage.js';

export const authRouter: Router = Router();

authRouter.post('/register', (req, res) => {
  const request = validateRequestBody<RegisterRequestDTO>(req.body, [
    'email',
    'first_name',
    'last_name',
    'password',
  ]);

  if (!request.ok) {
    return res.status(400).json({
      message: 'Некорректные поля были переданы при запросе.',
      invalidFields: request.invalidFields,
    });
  }

  const registrationResult = createUser(request.value);
  if (!registrationResult.ok) {
    return res.status(400).json({
      message: registrationResult.message,
    });
  }

  const response = registrationResult.user as RegisterResponseDTO;
  const { password_hash, ...user } = response;

  return res.status(201).json(user);
});

authRouter.post('/login', (req, res) => {
  const request = validateRequestBody<LoginRequestDTO>(req.body, [
    'email',
    'password',
  ]);

  if (!request.ok) {
    return res.status(400).json({
      message: 'Некорректные поля были переданы при запросе.',
      invalidFields: request.invalidFields,
    });
  }

  const loginResult = loginUser(request.value);
  if (!loginResult.ok) {
    return res.status(400).json({
      message: loginResult.message,
    });
  }

  const { password_hash, ...user } = loginResult.user;
  const access_token = createAccessToken(loginResult.user);
  const refresh_token = createRefreshToken(loginResult.user);

  const response = {
    access_token,
    refresh_token,
    ...user,
  } as LoginResponseDTO;
  return res.status(200).json(response);
});

authRouter.post('/refresh', (req, res) => {
  const request = validateRequestBody<RefreshRequestDTO>(req.body, [
    'refresh_token',
  ]);

  if (!request.ok) {
    return res.status(400).json({
      message: 'Некорректные поля были переданы при запросе.',
      invalidFields: request.invalidFields,
    });
  }

  const payload = validateRefreshToken(request.value.refresh_token);
  if (!payload) {
    return res.status(401).json({
      message: 'Невалидный или истёкший refresh-токен.',
    });
  }

  const userId = payload.sub as string;
  const user = findUserById(userId);
  if (!user) {
    return res.status(401).json({
      message: 'Пользователь не найден.',
    });
  }

  revokeRefreshToken(request.value.refresh_token);
  const access_token = createAccessToken(user);
  const refresh_token = createRefreshToken(user);

  const response: RefreshResponseDTO = {
    access_token,
    refresh_token,
  };
  return res.status(200).json(response);
});

authRouter.post('/logout', (req, res) => {
  const request = validateRequestBody<LogoutRequestDTO>(req.body, [
    'refresh_token',
  ]);

  if (!request.ok) {
    return res.status(400).json({
      message: 'Некорректные поля были переданы при запросе.',
      invalidFields: request.invalidFields,
    });
  }

  revokeRefreshToken(request.value.refresh_token);
  return res.status(200).json({ message: 'Выход выполнен успешно.' });
});

authRouter.post('/logout-all', authMiddleware, (req, res) => {
  revokeAllUserRefreshTokens(req.user.id);
  return res.status(200).json({ message: 'Все сессии завершены.' });
});

authRouter.get('/me', authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});
