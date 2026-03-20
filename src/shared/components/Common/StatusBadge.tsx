export interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'pending' | 'active' | 'inactive' | 'in-transit' | 'distributed' | 'offline' | 'online';
  label?: string;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export const StatusBadge = ({
  status,
  label,
  size = 'md',
  showDot = true,
  className = '',
}: StatusBadgeProps) => {
  const statusConfig = {
    success: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    warning: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    error: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
    info: { bg: 'bg-primary-light/20', text: 'text-primary-dark', dot: 'bg-primary' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400 animate-pulse' },
    active: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500 animate-pulse' },
    inactive: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    'in-transit': { bg: 'bg-primary-light/20', text: 'text-primary-dark', dot: 'bg-primary-light' },
    distributed: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    offline: { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
    online: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500 animate-pulse' },
  };

  const defaultLabels = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    info: 'Info',
    pending: 'Pending',
    active: 'Active',
    inactive: 'Inactive',
    'in-transit': 'In Transit',
    distributed: 'Distributed',
    offline: 'Offline',
    online: 'Online',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
  };

  const displayLabel = label || defaultLabels[status];

  const config = statusConfig[status];

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${config.bg} ${config.text} ${sizeStyles[size]}
        ${className}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {displayLabel}
    </span>
  );
};