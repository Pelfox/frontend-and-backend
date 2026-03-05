import type {
  LoginRequestDTO,
  LoginResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
} from '../dto/index.js';
import { Router } from 'express';
import { authMiddleware } from '../auth.middleware.js';
import { validateRequestBody } from '../dto/index.js';
import { createAccessToken } from '../jwt.service.js';
import { createUser, loginUser } from '../userStorage.js';

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

  const response = {
    access_token,
    ...user,
  } as LoginResponseDTO;
  return res.status(200).json(response);
});

authRouter.get('/me', authMiddleware, (req, res) => {
  res.status(200).json(req.user);
});
