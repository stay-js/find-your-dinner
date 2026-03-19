import { CircleAlert } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty';
import { cn } from '~/lib/utils';

type NoContentProps = {
  action?: React.ReactNode;
  className?: string;
  description: React.ReactNode;
  title: React.ReactNode;
};

export function NoContent({ action, className, description, title }: NoContentProps) {
  return (
    <div className={cn('grid h-full place-content-center', className)}>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CircleAlert />
          </EmptyMedia>

          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>

        {action && <EmptyContent>{action}</EmptyContent>}
      </Empty>
    </div>
  );
}
