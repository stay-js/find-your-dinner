import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '~/components/ui/combobox';
import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';

type FormComboboxProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TItemValue extends number | string,
> = (PathValue<TFieldValues, TName> extends string
  ? {} // eslint-disable-line @typescript-eslint/no-empty-object-type
  : { _error: 'Field value must match input value type' }) & {
  control: Control<TFieldValues>;
  name: TName;

  disabled?: boolean;
  emptyText?: string;
  label: React.ReactNode;
  options: Option<TItemValue>[];
  placeholder?: string;
};

type Option<T extends number | string> = { label: string; value: T };

export function FormCombobox<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TItemValue extends number | string,
>({
  control,
  disabled,
  label,
  name,
  options,
  placeholder,
}: FormComboboxProps<TFieldValues, TName, TItemValue>) {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => {
          const selectedItem =
            options.find((option) => option.value.toString() === field.value) ?? null;

          return (
            <Field data-invalid={fieldState.invalid}>
              <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
                <FieldLabel>{label}</FieldLabel>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </div>

              <Combobox
                autoHighlight
                disabled={disabled}
                items={options}
                itemToStringValue={(item) => item.label}
                onValueChange={(option) => field.onChange(option?.value.toString() ?? '')}
                value={selectedItem}
              >
                <ComboboxInput
                  aria-invalid={fieldState.invalid}
                  disabled={disabled}
                  placeholder={placeholder}
                  showClear={!!field.value}
                />
                <ComboboxContent>
                  <ComboboxEmpty>Nincs találat</ComboboxEmpty>

                  <ComboboxList>
                    {(item: Option<TItemValue>) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>
          );
        }}
      />
    </FieldGroup>
  );
}
