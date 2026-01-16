'use client';

import * as React from 'react';
import { type FieldValues, type UseFormReturn } from 'react-hook-form';

import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';

export interface FormRootProps<TFieldValues extends FieldValues> extends Omit<
  React.ComponentProps<'form'>,
  'onSubmit'
> {
  form: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
}

export function FormRoot<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  ...props
}: FormRootProps<TFieldValues>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-6', className)} {...props}>
        {children}
      </form>
    </Form>
  );
}
