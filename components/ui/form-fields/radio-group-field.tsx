'use client';

import * as React from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options: RadioOption[];
  disabled?: boolean;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  disabled,
  className,
  orientation = 'vertical',
}: RadioGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          {description && <FormDescription>{description}</FormDescription>}
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
              className={orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-3'}
            >
              {options.map((option) => (
                <div key={option.value} className="flex items-start space-x-3">
                  <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                  <div className="grid gap-1 leading-none">
                    <Label htmlFor={`${name}-${option.value}`} className="cursor-pointer font-normal">
                      {option.label}
                    </Label>
                    {option.description && <p className="text-muted-foreground text-sm">{option.description}</p>}
                  </div>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
