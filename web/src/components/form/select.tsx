import {
  type Control,
  Controller,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Select, SelectContent, SelectTrigger, SelectValue } from '~/components/ui/select';

type FormSelectProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = (PathValue<TFieldValues, TName> extends SelectValue
  ? {} // eslint-disable-line @typescript-eslint/no-empty-object-type
  : { _error: 'Field value must match select value type' }) & {
  errorPosition?: 'bottom' | 'top';

  control: Control<TFieldValues>;
  name: TName;

  disabled?: boolean;
  label: string;
  placeholder?: string;

  children?: React.ReactNode;
};

type SelectValue = null | React.InputHTMLAttributes<HTMLSelectElement>['value'];

export function FormSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  children,
  control,
  disabled,
  errorPosition = 'top',
  label,
  name,
  placeholder,
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FieldGroup>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <div className="flex flex-wrap justify-between gap-x-4 gap-y-2">
              <FieldLabel htmlFor={name}>{label}</FieldLabel>
              {fieldState.invalid && errorPosition === 'top' && (
                <FieldError errors={[fieldState.error]} />
              )}
            </div>

            <Select
              {...field}
              aria-invalid={fieldState.invalid}
              disabled={disabled}
              onValueChange={field.onChange}
              value={field.value ?? ''}
            >
              <SelectTrigger aria-invalid={fieldState.invalid} id={name}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>{children}</SelectContent>
            </Select>

            {fieldState.invalid && errorPosition === 'bottom' && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
