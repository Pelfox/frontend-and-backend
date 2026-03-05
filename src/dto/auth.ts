import type { User } from '../models/user.js';

export interface RegisterRequestDTO {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

// ответ на запрос - созданная сущность пользователя
export interface RegisterResponseDTO extends User {}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO extends User {}
