'use client';

import * as React from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';

export interface SliderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Slider>, 'name' | 'value' | 'onValueChange'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
}

export function SliderField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  showValue = false,
  formatValue = (v) => String(v),
  className,
  ...props
}: SliderFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex items-center justify-between">
            {label && <FormLabel>{label}</FormLabel>}
            {showValue && (
              <span className="text-muted-foreground text-sm">
                {formatValue(Array.isArray(field.value) ? field.value[0] : field.value)}
              </span>
            )}
          </div>
          <FormControl>
            <Slider
              value={Array.isArray(field.value) ? field.value : [field.value]}
              onValueChange={(values) => field.onChange(values[0])}
              {...props}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
