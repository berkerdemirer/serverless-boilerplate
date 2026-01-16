/**
 * Form Field Components
 *
 * PERFORMANCE TIP (bundle-barrel-imports):
 * For optimal tree-shaking, import directly from the source file:
 *
 * @example
 * // ✅ Better - only loads InputField code
 * import { InputField } from "@/components/ui/form-fields/input-field"
 *
 * // ❌ May include unused components in bundle
 * import { InputField } from "@/components/ui/form-fields"
 *
 * Heavy components (DatePickerField, ComboboxField, MultiSelectField)
 * are available as lazy-loaded versions for code splitting:
 *
 * @example
 * import { LazyDatePickerField } from "@/components/ui/form-fields/lazy"
 */

// Form wrapper
export { FormRoot, type FormRootProps } from './form-root';

// Basic fields
export { InputField, type InputFieldProps } from './input-field';
export { TextareaField, type TextareaFieldProps } from './textarea-field';
export { PasswordField, type PasswordFieldProps } from './password-field';
export { NumberField, type NumberFieldProps } from './number-field';

// Selection fields
export { CheckboxField, type CheckboxFieldProps } from './checkbox-field';
export { SwitchField, type SwitchFieldProps } from './switch-field';
export { SelectField, type SelectFieldProps, type SelectOption } from './select-field';
export { RadioGroupField, type RadioGroupFieldProps, type RadioOption } from './radio-group-field';
export { ComboboxField, type ComboboxFieldProps, type ComboboxOption } from './combobox-field';
export { MultiSelectField, type MultiSelectFieldProps, type MultiSelectOption } from './multi-select-field';
export { ToggleGroupField, type ToggleGroupFieldProps, type ToggleGroupOption } from './toggle-group-field';

// Date/Time fields
export { DatePickerField, type DatePickerFieldProps } from './date-picker-field';

// Specialized fields
export { SliderField, type SliderFieldProps } from './slider-field';
export { OTPField, type OTPFieldProps } from './otp-field';
export { FileField, type FileFieldProps } from './file-field';
