export * from './auth.js';
export * from './products.js';

export type ValidationResult<T> =
  | {
      ok: false;
      invalidFields: string[];
    }
  | {
      ok: true;
      value: T;
    };

export const validateRequestBody = <T>(
  body: object,
  fields: string[],
): ValidationResult<T> => {
  if (typeof body != 'object' || !body) {
    return { ok: false, invalidFields: [] };
  }

  const request = body as Record<string, unknown>;
  const invalidFields = fields.filter((field) => {
    const requestField = request[field];
    if (!requestField || typeof requestField !== 'string') {
      return true;
    }
    return requestField.trim().length === 0;
  });

  if (invalidFields.length !== 0) {
    return { ok: false, invalidFields };
  }

  return { ok: true, value: request as T };
};
