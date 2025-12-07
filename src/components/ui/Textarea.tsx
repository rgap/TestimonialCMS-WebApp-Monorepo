import { TextareaHTMLAttributes, forwardRef, useId } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const errorId = error ? `${textareaId}-error` : undefined;
    const helperId = helperText ? `${textareaId}-helper` : undefined;
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block mb-2 text-sm font-medium text-[var(--color-text-primary)]">
            {label}
            {props.required && <span className="text-[var(--color-error-600)] ml-1" aria-label="requerido">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : helperId}
          className={`w-full px-4 py-2.5 bg-white border-2 rounded-lg transition-all duration-200 min-h-[120px]
            ${error 
              ? 'border-[var(--color-error-600)] focus:ring-2 focus:ring-[var(--color-error-200)] focus:border-[var(--color-error-600)]' 
              : 'border-[var(--color-border)] focus:border-[var(--color-primary-600)] focus:ring-2 focus:ring-[var(--color-primary-200)]'
            }
            outline-none text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] resize-y
            disabled:bg-[var(--color-neutral-100)] disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-2 text-sm font-medium text-[var(--color-error-700)]" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-2 text-sm text-[var(--color-text-secondary)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';