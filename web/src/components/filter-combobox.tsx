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
  ComboboxValue,
  useComboboxAnchor,
} from '~/components/ui/combobox';
import { cn } from '~/lib/utils';

type FilterComboboxProps = {
  className?: string;
  disabled?: boolean;
  label: string;
  onValueChange: (value: number[]) => void;
  options: Option[];
  placeholder?: string;
  value: number[];
};

type Option = { label: string; value: number };

export function FilterCombobox({
  className,
  disabled,
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: FilterComboboxProps) {
  const id = useId();
  const anchor = useComboboxAnchor();

  const selectedOptions = useMemo(
    () => options.filter((option) => value.includes(option.value)),
    [options, value],
  );

  return (
    <div className={cn('flex flex-1 flex-col gap-2', className)}>
      <label className="block text-sm font-medium" htmlFor={id}>
        {label}
      </label>

      <Combobox
        autoHighlight
        disabled={disabled}
        items={options}
        itemToStringValue={(item) => item.label}
        multiple
        onValueChange={(newSelectedOptions) => {
          onValueChange(newSelectedOptions.map((option) => option.value));
        }}
        value={selectedOptions}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {value.map((val) => {
              const option = options.find((x) => x.value === val);
              return option ? <ComboboxChip key={option.value}>{option.label}</ComboboxChip> : null;
            })}
          </ComboboxValue>
          <ComboboxChipsInput id={id} placeholder={placeholder} />
        </ComboboxChips>

        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Nincs találat</ComboboxEmpty>

          <ComboboxList>
            {(item: Option) => (
              <ComboboxItem key={item.value} value={item}>
                {item.label}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
