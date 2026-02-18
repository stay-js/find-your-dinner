import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Select, SelectTrigger, SelectValue, SelectContent } from '~/components/ui/select';

type SelectValue = React.InputHTMLAttributes<HTMLSelectElement>['value'] | null;

type FormSelectProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  disabled?: boolean;
  label: string;
  placeholder?: string;
  children?: React.ReactNode;
  errorPosition?: 'top' | 'bottom';
} & (PathValue<TFieldValues, TName> extends SelectValue
  ? {} // eslint-disable-line @typescript-eslint/no-empty-object-type
  : { _error: 'Field value must match select value type' });

export function FormSelect<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  name,
  control,
  disabled,
  label,
  placeholder,
  children,
  errorPosition = 'top',
}: FormSelectProps<TFieldValues, TName>) {
  return (
    <FieldGroup>
      <Controller
        name={name}
        control={control}
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
              disabled={disabled}
              value={field.value ?? ''}
              onValueChange={field.onChange}
              aria-invalid={fieldState.invalid}
            >
              <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
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
