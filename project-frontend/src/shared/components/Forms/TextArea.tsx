import { forwardRef, useState } from 'react';
import type { TextareaHTMLAttributes } from 'react';
import { AlertCircle } from 'lucide-react';
import { Label } from './Label';
import { FormError } from './FormError';
import { FormHelper } from './FormHelper';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  showCharCount?: boolean;
  maxLength?: number;
  rows?: number;
  containerClassName?: string;
  labelClassName?: string;
  textareaClassName?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      error,
      helper,
      required,
      showCharCount,
      maxLength,
      rows = 4,
      containerClassName = '',
      labelClassName = '',
      textareaClassName = '',
      resize = 'vertical',
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
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(typeof value === 'string' ? value.length : 0);
    
    const hasError = !!error;
    const textareaId = id || name || `textarea-${Math.random().toString(36).substr(2, 9)}`;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const getResizeStyle = () => {
      switch (resize) {
        case 'none':
          return 'resize-none';
        case 'vertical':
          return 'resize-y';
        case 'horizontal':
          return 'resize-x';
        case 'both':
          return 'resize';
        default:
          return 'resize-y';
      }
    };

    const getTextAreaStyles = () => {
      let styles = 'w-full rounded-lg border transition-all duration-200 outline-none ';
      styles += 'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 ';
      styles += 'read-only:bg-gray-50 read-only:cursor-default ';
      styles += `py-2.5 px-4 text-gray-900 placeholder-gray-400 ${getResizeStyle()} `;
      
      if (hasError) {
        styles += 'border-error focus:ring-2 focus:ring-error/20 focus:border-error ';
      } else if (isFocused) {
        styles += 'border-primary ring-2 ring-primary/20 ';
      } else {
        styles += 'border-gray-300 hover:border-primary/50 ';
      }
      
      return styles;
    };

    const isNearLimit = maxLength && charCount > maxLength * 0.9;
    const isOverLimit = maxLength && charCount > maxLength;

    return (
      <div className={`w-full ${containerClassName}`}>
        <div className="flex justify-between items-center">
          {label && (
            <Label htmlFor={textareaId} required={required} className={labelClassName}>
              {label}
            </Label>
          )}
          {showCharCount && maxLength && (
            <span className={`text-xs ${isOverLimit ? 'text-error' : isNearLimit ? 'text-warning' : 'text-gray-400'}`}>
              {charCount} / {maxLength}
            </span>
          )}
        </div>
        
        <div className="relative mt-1">
          <textarea
            ref={ref}
            id={textareaId}
            name={name}
            rows={rows}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            readOnly={readOnly}
            placeholder={placeholder}
            maxLength={maxLength}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? `${textareaId}-error` : helper ? `${textareaId}-helper` : undefined
            }
            className={`${getTextAreaStyles()} ${textareaClassName}`}
            {...props}
          />

          {/* Error Icon */}
          {hasError && (
            <div className="absolute right-3 top-3">
              <AlertCircle size={16} className="text-error" />
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {hasError ? (
          <FormError id={`${textareaId}-error`}>{error}</FormError>
        ) : helper ? (
          <FormHelper id={`${textareaId}-helper`}>{helper}</FormHelper>
        ) : null}

        {/* Character Limit Warning */}
        {showCharCount && maxLength && isOverLimit && (
          <FormError>Character limit exceeded by {charCount - maxLength}</FormError>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';