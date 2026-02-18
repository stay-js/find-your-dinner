export function getPagination(pageString: null | string, total: number, pageSize: number) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const parsed = Number(pageString);
  const page = Number.isInteger(parsed) ? parsed : 1;

  const safePage = Math.min(Math.max(1, page), pageCount);

  return {
    page: safePage,
    pageCount,
  };
}
