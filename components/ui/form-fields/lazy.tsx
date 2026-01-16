'use client';

/**
 * Lazy-loaded form field components for code splitting.
 *
 * Use these for heavy components that include large dependencies
 * (Calendar, Command/cmdk) to reduce initial bundle size.
 *
 * @example
 * import { LazyDatePickerField } from "@/components/ui/form-fields/lazy"
 *
 * <Suspense fallback={<InputSkeleton />}>
 *   <LazyDatePickerField control={form.control} name="date" />
 * </Suspense>
 */

import dynamic from 'next/dynamic';
import type { DatePickerFieldProps } from './date-picker-field';
import type { ComboboxFieldProps } from './combobox-field';
import type { MultiSelectFieldProps } from './multi-select-field';
import type { FieldPath, FieldValues } from 'react-hook-form';

/**
 * Lazy-loaded DatePickerField - includes Calendar (~15kb) and date-fns
 */
export const LazyDatePickerField = dynamic(() => import('./date-picker-field').then((mod) => mod.DatePickerField), {
  ssr: false,
}) as <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: DatePickerFieldProps<TFieldValues, TName>,
) => React.JSX.Element;

/**
 * Lazy-loaded ComboboxField - includes Command/cmdk (~10kb)
 */
export const LazyComboboxField = dynamic(() => import('./combobox-field').then((mod) => mod.ComboboxField), {
  ssr: false,
}) as <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: ComboboxFieldProps<TFieldValues, TName>,
) => React.JSX.Element;

/**
 * Lazy-loaded MultiSelectField - includes Command/cmdk (~10kb)
 */
export const LazyMultiSelectField = dynamic(() => import('./multi-select-field').then((mod) => mod.MultiSelectField), {
  ssr: false,
}) as <TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>(
  props: MultiSelectFieldProps<TFieldValues, TName>,
) => React.JSX.Element;
