import {
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
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
      className={cn('flex items-center gap-0.5', className)}
      data-slot="pagination-content"
      {...props}
    />
  );
}

function PaginationEllipsis({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      aria-hidden
      className={cn(
        "flex size-8 items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      data-slot="pagination-ellipsis"
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">További oldalak</span>
    </span>
  );
}

function PaginationFirst({ className, ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label="Első oldal" className={className} size="icon" {...props}>
      <ChevronFirstIcon />
      <span className="sr-only">Első oldal</span>
    </PaginationButton>
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLast({ className, ...props }: React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton aria-label="Utolsó oldal" className={className} size="icon" {...props}>
      <ChevronLastIcon />
      <span className="sr-only">Utolsó oldal</span>
    </PaginationButton>
  );
}

function PaginationNext({
  className,
  text = 'Következő',
  ...props
}: { text?: string } & React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Tovább a következő oldalra"
      className={cn('pr-1.5!', className)}
      size="default"
      {...props}
    >
      <span className="hidden sm:block">{text}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationButton>
  );
}

function PaginationPrevious({
  className,
  text = 'Előző',
  ...props
}: { text?: string } & React.ComponentProps<typeof PaginationButton>) {
  return (
    <PaginationButton
      aria-label="Vissza az előző oldalra"
      className={cn('pl-1.5!', className)}
      size="default"
      {...props}
    >
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text}</span>
    </PaginationButton>
  );
}

export {
  Pagination,
  PaginationButton,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationNext,
  PaginationPrevious,
};
