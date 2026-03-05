import { Router } from 'express';
import {
  validateRequestBody,
  type CreateProductRequestDTO,
  type CreateProductResponseDTO,
} from '../dto/index.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductByID,
  updateProduct,
} from '../productStorage.js';

export const productsRouter: Router = Router();

productsRouter.post('/', (req, res) => {
  const request = validateRequestBody<CreateProductRequestDTO>(req.body, [
    'title',
    'category',
    'description',
    'price',
  ]);
  if (!request.ok) {
    return res.status(400).json({
      message: 'Некорректные поля были переданы при запросе.',
      invalidFields: request.invalidFields,
    });
  }

  const createResult = createProduct(request.value);
  if (!createResult.ok) {
    return res.status(400).json({
      message: createResult.message,
    });
  }

  const response = createResult.value as CreateProductResponseDTO;
  return res.status(201).json(response);
});

productsRouter.get('/', (_, res) => {
  const products = getAllProducts();
  return res.status(200).json(products);
});

productsRouter.get('/:id', (req, res) => {
  const getResult = getProductByID(req.params.id);
  if (!getResult.ok) {
    return res.status(400).json({
      message: getResult.message,
    });
  }
  return res.status(200).json(getResult.value);
});

productsRouter.put('/:id', (req, res) => {
  const updateResult = updateProduct(req.params.id, req.body);
  if (!updateResult.ok) {
    return res.status(400).json({
      message: updateResult.message,
    });
  }
  return res.status(200).json(updateResult.value);
});

productsRouter.delete('/:id', (req, res) => {
  const deleteResult = deleteProduct(req.params.id);
  if (!deleteResult.ok) {
    return res.status(400).json({
      message: deleteResult.message,
    });
  }
  return res.status(204);
});
