import { forwardRef, useState } from 'react';
import type {SelectHTMLAttributes} from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { Label } from './Label';
import { FormError } from './FormError';
import { FormHelper } from './FormHelper';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helper?: string;
  required?: boolean;
  placeholder?: string;
  containerClassName?: string;
  labelClassName?: string;
  selectClassName?: string;
  leftIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options,
      error,
      helper,
      required,
      placeholder,
      containerClassName = '',
      labelClassName = '',
      selectClassName = '',
      leftIcon,
      value,
      disabled,
      className,
      id,
      name,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const hasError = !!error;
    const selectId = id || name || `select-${Math.random().toString(36).substr(2, 9)}`;

    const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getSelectStyles = () => {
      let styles = 'w-full rounded-lg border transition-all duration-200 outline-none appearance-none ';
      styles += 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ';
      styles += 'py-2.5 pr-10 text-gray-900 ';
      
      if (leftIcon) styles += 'pl-10 ';
      else styles += 'pl-4 ';
      
      if (hasError) {
        styles += 'border-error focus:ring-2 focus:ring-error/20 focus:border-error ';
      } else if (isFocused) {
        styles += 'border-primary ring-2 ring-primary/20 ';
      } else {
        styles += 'border-gray-300 hover:border-primary/50 ';
      }
      
      return styles;
    };

    const hasValue = value !== undefined && value !== '' && value !== null;

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <Label htmlFor={selectId} required={required} className={labelClassName}>
            {label}
          </Label>
        )}
        
        <div className="relative mt-1">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
              {leftIcon}
            </div>
          )}

          {/* Select Element */}
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={value}
            disabled={disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-describedby={
              hasError ? `${selectId}-error` : helper ? `${selectId}-helper` : undefined
            }
            className={`${getSelectStyles()} ${selectClassName}`}
            {...props}
          >
            {placeholder && (
              <option value="" disabled hidden>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <ChevronDown size={18} className={`text-gray-400 transition-transform ${isFocused ? 'rotate-180' : ''}`} />
          </div>

          {/* Error Icon */}
          {hasError && (
            <div className="absolute right-10 top-1/2 -translate-y-1/2">
              <AlertCircle size={16} className="text-error" />
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {hasError ? (
          <FormError id={`${selectId}-error`}>{error}</FormError>
        ) : helper ? (
          <FormHelper id={`${selectId}-helper`}>{helper}</FormHelper>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';