import { pageSchema } from '~/lib/zod';

export function getPagination(pageString: null | string, total: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const page = pageSchema.transform((value) => Math.min(value, pageCount)).parse(pageString);

  return { page, pageCount };
}
