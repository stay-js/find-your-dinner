import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

type PaginationButtonProps = {
  isActive?: boolean;
} & React.ComponentProps<'button'> &
  Pick<React.ComponentProps<typeof Button>, 'size'>;

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      aria-label="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      data-slot="pagination"
      role="navigation"
      {...props}
    />
  );
}

function PaginationButton({ isActive, size = 'icon', ...props }: PaginationButtonProps) {
  return (
    <Button
      aria-current={isActive ? 'page' : undefined}
      data-active={isActive}
      data-slot="pagination-button"
      size={size}
      variant={isActive ? 'outline' : 'ghost'}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      className={cn('flex flex-row items-center gap-1', className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn('flex size-9 items-center justify-center', className)}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">További oldalak</span>
    </span>
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationNext({ className, ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to next page"
      className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
      size="default"
      {...props}
    >
      <span className="hidden sm:block">Következő</span>
      <ChevronRightIcon />
    </PaginationButton>
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Go to previous page"
      className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
      size="default"
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Előző</span>
    </PaginationButton>
  );
}

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
};
