'use client';

import * as React from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export interface ToggleGroupOption {
  label: React.ReactNode;
  value: string;
}

export interface ToggleGroupFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  options: ToggleGroupOption[];
  type?: 'single' | 'multiple';
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  disabled?: boolean;
  className?: string;
}

export function ToggleGroupField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  options,
  type = 'single',
  variant = 'outline',
  size = 'default',
  disabled,
  className,
}: ToggleGroupFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {type === 'single' ? (
              <ToggleGroup
                type="single"
                value={field.value}
                onValueChange={field.onChange}
                variant={variant}
                size={size}
                disabled={disabled}
              >
                {options.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            ) : (
              <ToggleGroup
                type="multiple"
                value={field.value}
                onValueChange={field.onChange}
                variant={variant}
                size={size}
                disabled={disabled}
              >
                {options.map((option) => (
                  <ToggleGroupItem key={option.value} value={option.value}>
                    {option.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
