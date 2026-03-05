import type { Product } from '../models/product.js';

export interface CreateProductRequestDTO {
  title: string;
  category: string;
  description: string;
  price: string; // будет конвертировано в number
}

export interface CreateProductResponseDTO extends Product {}

export interface UpdateProductRequestDTO {
  title?: string;
  category?: string;
  description?: string;
  price?: string;
}

export interface UpdateProductResponseDTO extends Product {}
