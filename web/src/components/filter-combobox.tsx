'use client';

import { useId, useMemo } from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from '~/components/ui/combobox';
import { cn } from '~/lib/utils';

type FilterComboboxProps = {
  className?: string;
  disabled?: boolean;
  emptyText?: string;
  label: string;
  onValueChange: (value: number[]) => void;
  options: { label: string; value: number }[];
  placeholder?: string;
  value: number[];
};

export function FilterCombobox({
  className,
  disabled,
  emptyText = 'Nincs találat',
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: FilterComboboxProps) {
  const id = useId();
  const anchor = useComboboxAnchor();

  const selectedValues = useMemo(
    () => options.filter((option) => value.includes(option.value)).map((option) => option.value),
    [options, value],
  );

  return (
    <div className={cn('flex flex-1 flex-col gap-2', className)}>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>

      <Combobox disabled={disabled} multiple onValueChange={onValueChange} value={selectedValues}>
        <ComboboxChips ref={anchor}>
          {value.map((val) => {
            const option = options.find((x) => x.value === val);
            return option ? <ComboboxChip key={option.value}>{option.label}</ComboboxChip> : null;
          })}
          <ComboboxChipsInput id={id} placeholder={placeholder} />
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxList>
            <ComboboxEmpty>{emptyText}</ComboboxEmpty>

            {options.map((option) => (
              <ComboboxItem key={option.value} value={option.value}>
                {option.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
