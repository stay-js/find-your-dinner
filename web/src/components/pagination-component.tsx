import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { useCreateQueryString } from '~/lib/use-create-query-string';

type PaginationComponentProps = {
  currentPage: number;
  pageCount: number;
};

export function PaginationComponent({ currentPage, pageCount }: PaginationComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const createQueryString = useCreateQueryString(searchParams);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  const handlePageChange = (page: number) => {
    router.replace(pathname + '?' + createQueryString('page', page.toString()), { scroll: false });
  };

  if (pageCount <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={!hasPrevPage}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {pageNumbers.map((p, i) =>
          p === 'ellipsis' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationButton isActive={p === currentPage} onClick={() => handlePageChange(p)}>
                {p}
              </PaginationButton>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            disabled={!hasNextPage}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function getPageNumbers(currentPage: number, pageCount: number): Array<'ellipsis' | number> {
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const pages: Array<'ellipsis' | number> = [1];

  if (currentPage > 3) pages.push('ellipsis');

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(pageCount - 1, currentPage + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (currentPage < pageCount - 2) pages.push('ellipsis');

  pages.push(pageCount);

  return pages;
}
