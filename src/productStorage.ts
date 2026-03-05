import { randomUUID } from 'node:crypto';
import type {
  CreateProductRequestDTO,
  UpdateProductRequestDTO,
} from './dto/products.js';
import type { Product } from './models/product.js';

let products: Product[] = [];

type ProductResult =
  | {
      ok: false;
      message: string;
    }
  | {
      ok: true;
      value: Product;
    };

export const createProduct = (
  request: CreateProductRequestDTO,
): ProductResult => {
  const existingProduct = products.find(
    (product) =>
      product.title === request.title && product.category === request.category,
  );
  if (existingProduct) {
    return {
      ok: false,
      message: 'Продукт с таким названием уже существует для данной категории.',
    };
  }

  const { price, ...rest } = request;
  const parsedPrice = Number(price);
  console.log('Parsed price:', parsedPrice);

  if (Number.isNaN(parsedPrice) || !Number.isFinite(parsedPrice)) {
    return {
      ok: false,
      message: 'Указана некорректная цена.',
    };
  }

  const product = {
    id: randomUUID(),
    price: parsedPrice,
    ...rest,
  };
  products.push(product);

  return { ok: true, value: product };
};

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductByID = (id: string): ProductResult => {
  const product = products.find((product) => product.id === id);
  if (!product) {
    return {
      ok: false,
      message: 'Продукт с таким ID не существует.',
    };
  }
  return { ok: true, value: product };
};

export const updateProduct = (
  id: string,
  request: UpdateProductRequestDTO,
): ProductResult => {
  const product = products.find((product) => product.id === id);
  if (!product) {
    return {
      ok: false,
      message: 'Продукт с таким ID не существует.',
    };
  }

  if (request.title) {
    product.title = request.title;
  }
  if (request.category) {
    product.category = request.category;
  }
  if (request.description) {
    product.description = request.description;
  }
  if (request.price) {
    const parsedPrice = Number(request.price);
    if (Number.isNaN(parsedPrice) || !Number.isFinite(parsedPrice)) {
      return {
        ok: false,
        message: 'Указана некорректная цена.',
      };
    }
    product.price = parsedPrice;
  }

  products = products.map((p) => (p.id === id ? product : p));
  return { ok: true, value: product };
};

export const deleteProduct = (id: string): ProductResult => {
  const product = products.find((product) => product.id === id);
  if (!product) {
    return {
      ok: false,
      message: 'Продукт с таким ID не существует.',
    };
  }
  products = products.filter((p) => p.id !== id);
  return { ok: true, value: {} as Product };
};
