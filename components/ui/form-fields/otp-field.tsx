'use client';

import * as React from 'react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';

export interface OTPFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  length?: number;
  groupSize?: number;
  disabled?: boolean;
  className?: string;
}

export function OTPField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  length = 6,
  groupSize = 3,
  disabled,
  className,
}: OTPFieldProps<TFieldValues, TName>) {
  const groups: number[][] = [];
  for (let i = 0; i < length; i += groupSize) {
    const group: number[] = [];
    for (let j = i; j < Math.min(i + groupSize, length); j++) {
      group.push(j);
    }
    groups.push(group);
  }

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <InputOTP maxLength={length} value={field.value} onChange={field.onChange} disabled={disabled}>
              {groups.map((group, groupIndex) => (
                <React.Fragment key={groupIndex}>
                  {groupIndex > 0 && <InputOTPSeparator />}
                  <InputOTPGroup>
                    {group.map((slotIndex) => (
                      <InputOTPSlot key={slotIndex} index={slotIndex} />
                    ))}
                  </InputOTPGroup>
                </React.Fragment>
              ))}
            </InputOTP>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
