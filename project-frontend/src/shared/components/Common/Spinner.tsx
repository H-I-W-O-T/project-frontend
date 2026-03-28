export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

export const Spinner = ({ size = 'md', color = 'primary', className = '' }: SpinnerProps) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colorStyles = {
    primary: 'border-primary/20 border-t-primary',
    white: 'border-white/20 border-t-white',
    gray: 'border-gray-200 border-t-gray-600',
  };

  return (
    <div
      className={`
        inline-block rounded-full animate-spin
        ${sizeStyles[size]}
        ${colorStyles[color]}
        ${className}
      `}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};