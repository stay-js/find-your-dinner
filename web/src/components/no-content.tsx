import { CircleAlert } from 'lucide-react';

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '~/components/ui/empty';

export function NoContent({
  create,
  title,
  description,
}: {
  create: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
}) {
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
