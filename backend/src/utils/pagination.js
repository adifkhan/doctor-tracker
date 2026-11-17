export const toSkipLimit = ({ page, limit }) => ({ skip: (page - 1) * limit, limit });

export const buildMeta = ({ page, limit }, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
