'use client';

import * as React from 'react';
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export interface MultiSelectOption {
  label: string;
  value: string;
}

export interface MultiSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: MultiSelectOption[];
  disabled?: boolean;
  className?: string;
  maxDisplayedItems?: number;
}

export function MultiSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  placeholder = 'Select items',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  options,
  disabled,
  className,
  maxDisplayedItems = 3,
}: MultiSelectFieldProps<TFieldValues, TName>) {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = Array.isArray(field.value) ? field.value : [];

        const toggleOption = (value: string) => {
          const newValues = selectedValues.includes(value)
            ? selectedValues.filter((v) => v !== value)
            : [...selectedValues, value];
          field.onChange(newValues);
        };

        const removeValue = (value: string, e: React.MouseEvent) => {
          e.stopPropagation();
          field.onChange(selectedValues.filter((v) => v !== value));
        };

        const displayedItems = selectedValues.slice(0, maxDisplayedItems);
        const remainingCount = selectedValues.length - maxDisplayedItems;

        return (
          <FormItem className={cn('flex flex-col', className)}>
            {label && <FormLabel>{label}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      'h-auto min-h-9 w-full justify-between',
                      !selectedValues.length && 'text-muted-foreground',
                    )}
                    disabled={disabled}
                  >
                    {selectedValues.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {displayedItems.map((value) => {
                          const option = options.find((o) => o.value === value);
                          return (
                            <Badge key={value} variant="secondary" className="mr-1">
                              {option?.label}
                              <button
                                type="button"
                                className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                                onClick={(e) => removeValue(value, e)}
                                aria-label={`Remove ${option?.label}`}
                              >
                                <XIcon className="h-3 w-3" />
                              </button>
                            </Badge>
                          );
                        })}
                        {remainingCount > 0 && <Badge variant="secondary">+{remainingCount} more</Badge>}
                      </div>
                    ) : (
                      placeholder
                    )}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput placeholder={searchPlaceholder} />
                  <CommandList>
                    <CommandEmpty>{emptyText}</CommandEmpty>
                    <CommandGroup>
                      {options.map((option) => {
                        const isSelected = selectedValues.includes(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            value={option.value}
                            onSelect={() => toggleOption(option.value)}
                          >
                            <div
                              className={cn(
                                'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                                isSelected ? 'bg-primary text-primary-foreground' : 'opacity-50 [&_svg]:invisible',
                              )}
                            >
                              <CheckIcon className="h-3 w-3" />
                            </div>
                            {option.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
