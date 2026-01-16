'use client';

import * as React from 'react';
import { FileIcon, UploadIcon, XIcon } from 'lucide-react';
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export interface FileFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  disabled?: boolean;
  className?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function FileField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  accept,
  multiple = false,
  maxSize,
  disabled,
  className,
}: FileFieldProps<TFieldValues, TName>) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const files: File[] = field.value ? (Array.isArray(field.value) ? field.value : [field.value]) : [];

        const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selectedFiles = e.target.files;
          if (!selectedFiles) return;

          const fileArray = Array.from(selectedFiles);

          if (maxSize) {
            const oversizedFiles = fileArray.filter((f) => f.size > maxSize);
            if (oversizedFiles.length > 0) {
              return;
            }
          }

          if (multiple) {
            field.onChange([...files, ...fileArray]);
          } else {
            field.onChange(fileArray[0]);
          }

          if (inputRef.current) {
            inputRef.current.value = '';
          }
        };

        const removeFile = (index: number) => {
          if (multiple) {
            const newFiles = files.filter((_, i) => i !== index);
            field.onChange(newFiles.length > 0 ? newFiles : undefined);
          } else {
            field.onChange(undefined);
          }
        };

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}
            <FormControl>
              <div className="space-y-3">
                <div
                  className={cn(
                    'cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors',
                    'hover:border-primary/50 hover:bg-muted/50',
                    disabled && 'cursor-not-allowed opacity-50',
                  )}
                  onClick={() => !disabled && inputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (disabled) return;

                    const droppedFiles = Array.from(e.dataTransfer.files);
                    if (droppedFiles.length > 0) {
                      if (multiple) {
                        field.onChange([...files, ...droppedFiles]);
                      } else {
                        field.onChange(droppedFiles[0]);
                      }
                    }
                  }}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    multiple={multiple}
                    onChange={handleFileChange}
                    disabled={disabled}
                    className="hidden"
                  />
                  <UploadIcon className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
                  <p className="text-muted-foreground text-sm">Drag and drop or click to upload</p>
                  {maxSize && <p className="text-muted-foreground mt-1 text-xs">Max size: {formatFileSize(maxSize)}</p>}
                </div>

                {files.length > 0 && (
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={`${file.name}-${index}`} className="flex items-center gap-2 rounded-md border p-2">
                        <FileIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{file.name}</p>
                          <p className="text-muted-foreground text-xs">{formatFileSize(file.size)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 shrink-0"
                          onClick={() => removeFile(index)}
                          disabled={disabled}
                          aria-label={`Remove ${file.name}`}
                        >
                          <XIcon className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
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
