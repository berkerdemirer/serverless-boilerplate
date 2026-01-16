'use client';

import * as React from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface CheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Checkbox>, 'name' | 'checked' | 'onCheckedChange'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
}

export function CheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, label, description, className, ...props }: CheckboxFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn('flex flex-row items-start space-y-0 space-x-3', className)}>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} {...props} />
          </FormControl>
          <div className="space-y-1 leading-none">
            {label && <FormLabel className="cursor-pointer">{label}</FormLabel>}
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}
