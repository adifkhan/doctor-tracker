const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const searchFilter = (search, fields) => {
  if (!search) return null;
  const regex = new RegExp(escapeRegex(search), 'i');
  return { $or: fields.map((field) => ({ [field]: regex })) };
};

export const dateRangeFilter = (from, to) => {
  if (!from && !to) return null;
  const range = {};
  if (from) range.$gte = from;
  if (to) {
    const end = new Date(to);
    end.setUTCHours(23, 59, 59, 999);
    range.$lte = end;
  }
  return { createdAt: range };
};

export const compact = (conditions) => {
  const active = conditions.filter(Boolean);
  return active.length ? { $and: active } : {};
};
