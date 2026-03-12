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

export interface LoginResponseDTO extends User {
  access_token: string;
  refresh_token: string;
}

export interface RefreshRequestDTO {
  refresh_token: string;
}

export interface RefreshResponseDTO {
  access_token: string;
  refresh_token: string;
}

export interface LogoutRequestDTO {
  refresh_token: string;
}
