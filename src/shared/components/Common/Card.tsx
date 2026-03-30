import type { ReactNode } from 'react';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: ReactNode;
  footer?: ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  header,
  footer,
  onClick, 
  hoverable = false,
}: CardProps) => {
  const variantStyles = {
    default: 'bg-white shadow-md',
    bordered: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white shadow-xl',
    gradient: 'bg-gradient-brand text-white shadow-md',
  };

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-7',
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer'
    : '';

  const headerStyles = variant === 'gradient' ? 'border-b border-white/20' : 'border-b border-gray-200';

  const footerStyles = variant === 'gradient' ? 'border-t border-white/20' : 'border-t border-gray-200';

  return (
    <div className={`rounded-xl overflow-hidden ${variantStyles[variant]} ${hoverStyles} ${className}`} onClick={onClick}>
      {header && (
        <div className={`${paddingStyles[padding]} ${headerStyles}`}>
          {header}
        </div>
      )}
      <div className={paddingStyles[padding]}>
        {children}
      </div>
      {footer && (
        <div className={`${paddingStyles[padding]} ${footerStyles} ${variant === 'gradient' ? 'bg-black/10' : 'bg-gray-50'}`}>
          {footer}
        </div>
      )}
    </div>
  );
};