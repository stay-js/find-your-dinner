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
  create: React.ReactNode;
  description: React.ReactNode;
  title: React.ReactNode;
};

export function NoContent({ create, description, title }: NoContentProps) {
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
        <EmptyContent>{create}</EmptyContent>
      </Empty>
    </div>
  );
}
