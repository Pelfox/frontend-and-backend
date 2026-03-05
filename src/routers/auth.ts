import { Router } from 'express';
import {
  validateRequestBody,
  type LoginRequestDTO,
  type LoginResponseDTO,
  type RegisterRequestDTO,
  type RegisterResponseDTO,
} from '../dto/index.js';
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
  return res.status(201).json(response);
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

  const response = loginResult.user as LoginResponseDTO;
  return res.status(200).json(response);
});
