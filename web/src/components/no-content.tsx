import { CircleAlert } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty';

type NoContentProps = {
  action?: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
};

export function NoContent({ action, description, title }: NoContentProps) {
  return (
    <div className="grid h-full place-content-center">
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
