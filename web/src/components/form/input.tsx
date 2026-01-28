import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type PathValue,
} from 'react-hook-form';

import { Field, FieldError, FieldGroup, FieldLabel } from '~/components/ui/field';
import { Input } from '~/components/ui/input';

type InputValue = React.InputHTMLAttributes<HTMLInputElement>['value'] | null;

type FormInputProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  name: TName;
  control: Control<TFieldValues>;
  disabled?: boolean;
  label: React.ReactNode;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  errorPosition?: 'top' | 'bottom';
  min?: number;
  max?: number;
  step?: number;
} & (PathValue<TFieldValues, TName> extends InputValue
  ? {}
  : { _error: 'Field value must match input value type' });

export function FormInput<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  name,
  control,
  disabled,
  label,
  placeholder,
  type = 'text',
  errorPosition = 'top',
  min,
  max,
  step,
}: FormInputProps<TFieldValues, TName>) {
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

            <Input
              {...field}
              id={name}
              type={type}
              disabled={disabled}
              value={field.value ?? ''}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
              min={min}
              max={max}
              step={step}
            />

            {fieldState.invalid && errorPosition === 'bottom' && (
              <FieldError errors={[fieldState.error]} />
            )}
          </Field>
        )}
      />
    </FieldGroup>
  );
}
