import { forwardRef, useState } from 'react';
import type {InputHTMLAttributes} from 'react';
import { Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import { Label } from './Label';
import { FormError } from './FormError';
import { FormHelper } from './FormHelper';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  showPasswordToggle?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      required,
      leftIcon,
      rightIcon,
      clearable,
      showPasswordToggle,
      containerClassName = '',
      labelClassName = '',
      inputClassName = '',
      type = 'text',
      value,
      onChange,
      onFocus,
      onBlur,
      disabled,
      readOnly,
      placeholder,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(event);
      setHasValue(false);
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    // Determine input styles based on state
    const getInputStyles = () => {
      let styles = 'w-full rounded-lg border transition-all duration-200 outline-none ';
      styles += 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ';
      styles += 'read-only:bg-gray-50 read-only:cursor-default ';
      
      // Padding adjustments for icons
      if (leftIcon) styles += 'pl-10 ';
      if (rightIcon || clearable || (isPasswordType && showPasswordToggle)) styles += 'pr-10 ';
      else styles += 'pr-4 ';
      
      styles += 'py-2.5 text-gray-900 placeholder-gray-400 ';
      
      // Border and ring styles based on state
      if (hasError) {
        styles += 'border-error focus:ring-2 focus:ring-error/20 focus:border-error ';
      } else if (isFocused) {
        styles += 'border-primary ring-2 ring-primary/20 ';
      } else {
        styles += 'border-gray-300 hover:border-primary/50 ';
      }
      
      return styles;
    };

    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <Label htmlFor={inputId} required={required} className={labelClassName}>
            {label}
          </Label>
        )}
        
        <div className="relative mt-1">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {/* Input Element */}
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={inputType}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${inputId}-error` : helper ? `${inputId}-helper` : undefined
            }
            className={`${getInputStyles()} ${inputClassName}`}
            {...props}
          />

          {/* Right Side Actions */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1">
            {/* Clear Button */}
            {clearable && hasValue && !disabled && !readOnly && (
              <button
                type="button"
                onClick={handleClear}
                className="p-0.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                aria-label="Clear input"
              >
                <X size={16} />
              </button>
            )}

            {/* Password Toggle */}
            {isPasswordType && showPasswordToggle && !disabled && !readOnly && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-0.5 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}

            {/* Custom Right Icon */}
            {rightIcon && !clearable && !(isPasswordType && showPasswordToggle) && (
              <div className="text-gray-400">{rightIcon}</div>
            )}

            {/* Error Icon */}
            {hasError && (
              <AlertCircle size={16} className="text-error" />
            )}
          </div>
        </div>

        {/* Helper Text or Error Message */}
        {hasError ? (
          <FormError id={`${inputId}-error`}>{error}</FormError>
        ) : helper ? (
          <FormHelper id={`${inputId}-helper`}>{helper}</FormHelper>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';