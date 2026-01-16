'use client';

import * as React from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export interface NumberFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, 'name' | 'type' | 'value' | 'onChange'> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  min?: number;
  max?: number;
  step?: number;
  showStepper?: boolean;
}

export function NumberField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  min,
  max,
  step = 1,
  showStepper = true,
  className,
  disabled,
  ...props
}: NumberFieldProps<TFieldValues, TName>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const currentValue = typeof field.value === 'number' ? field.value : 0;

        const increment = () => {
          const newValue = currentValue + step;
          if (max === undefined || newValue <= max) {
            field.onChange(newValue);
          }
        };

        const decrement = () => {
          const newValue = currentValue - step;
          if (min === undefined || newValue >= min) {
            field.onChange(newValue);
          }
        };

        const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value;
          if (value === '') {
            field.onChange(min ?? 0);
            return;
          }
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            if (min !== undefined && numValue < min) {
              field.onChange(min);
            } else if (max !== undefined && numValue > max) {
              field.onChange(max);
            } else {
              field.onChange(numValue);
            }
          }
        };

        return (
          <FormItem>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="flex items-center gap-2">
                {showStepper && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={decrement}
                    disabled={disabled || (min !== undefined && currentValue <= min)}
                    aria-label="Decrease value"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                )}
                <Input
                  type="number"
                  className={cn(
                    'text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                    className,
                  )}
                  value={field.value}
                  onChange={handleInputChange}
                  min={min}
                  max={max}
                  step={step}
                  disabled={disabled}
                  {...props}
                />
                {showStepper && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9 shrink-0"
                    onClick={increment}
                    disabled={disabled || (max !== undefined && currentValue >= max)}
                    aria-label="Increase value"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </FormControl>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
