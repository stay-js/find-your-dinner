import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination';
import { useMergeQueryString } from '~/hooks/use-merge-query-string';

type PaginationComponentProps = {
  currentPage: number;
  pageCount: number;
};

export function PaginationComponent({ currentPage, pageCount }: PaginationComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mergeQueryString = useMergeQueryString(searchParams);

  const hasPrevPage = currentPage > 1;
  const hasNextPage = currentPage < pageCount;

  const windowSize = Math.min(3, pageCount);
  const start = Math.min(Math.max(1, currentPage - 1), pageCount - windowSize + 1);
  const pages = Array.from({ length: windowSize }, (_, i) => start + i);

  function handlePageChange(page: number) {
    router.replace(`${pathname}?${mergeQueryString({ page: page.toString() })}`);
  }

  if (pageCount <= 1) return null;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst disabled={!hasPrevPage} onClick={() => handlePageChange(1)} />
        </PaginationItem>

        <PaginationItem>
          <PaginationPrevious
            disabled={!hasPrevPage}
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {start > 1 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationButton isActive={p === currentPage} onClick={() => handlePageChange(p)}>
              {p}
            </PaginationButton>
          </PaginationItem>
        ))}

        {start + windowSize - 1 < pageCount && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            disabled={!hasNextPage}
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>

        <PaginationItem>
          <PaginationLast disabled={!hasNextPage} onClick={() => handlePageChange(pageCount)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
