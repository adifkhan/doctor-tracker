import { z } from 'zod';

const emptyToUndefined = (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value);

export const optional = (schema) => z.preprocess(emptyToUndefined, schema.optional());

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid id');

export const idParams = z.object({ id: objectId });

export const paginationQuery = {
  page: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).default(1)),
  limit: z.preprocess(emptyToUndefined, z.coerce.number().int().min(1).max(50).default(10)),
  search: optional(z.string().trim()),
};

export const dateRangeQuery = {
  from: optional(z.coerce.date()),
  to: optional(z.coerce.date()),
};

export const validDateRange = (query) => !query.from || !query.to || query.from <= query.to;
export const dateRangeError = { message: '"from" must not be after "to"', path: ['from'] };
