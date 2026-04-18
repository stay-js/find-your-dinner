import { Trash2 } from 'lucide-react';
import { type ComponentProps, useState } from 'react';

import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Spinner } from '~/components/ui/spinner';

type DeletePopoverProps = {
  disabled?: boolean;
  isPending: boolean;
  onDelete: () => void;
  showText?: boolean;
  size?: ComponentProps<typeof Button>['size'];
  type: string;
};

export function DeletePopover({
  disabled,
  isPending,
  onDelete,
  showText,
  size = 'icon-sm',
  type,
}: DeletePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover onOpenChange={setIsOpen} open={isOpen}>
      <PopoverTrigger asChild>
        <Button disabled={disabled} size={size} type="button" variant="destructive">
          <Trash2 className="size-4" />
          {showText && <span>Törlés</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="flex flex-col gap-6">
        <PopoverHeader>
          <PopoverTitle>{type} törlése</PopoverTitle>
          <PopoverDescription>
            Biztosan törölni szeretnéd? Ez a művelet <b>végleges és visszafordíthatatlan</b>.
          </PopoverDescription>
        </PopoverHeader>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setIsOpen(false)} size="sm" type="button" variant="outline">
            Mégsem
          </Button>

          <Button
            disabled={isPending}
            onClick={onDelete}
            size="sm"
            type="button"
            variant="destructive"
          >
            {isPending && <Spinner />}
            <span>Törlés</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
