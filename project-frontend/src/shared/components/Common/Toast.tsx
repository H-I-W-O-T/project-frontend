import { useEffect } from 'react';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast = ({ id, type, title, message, duration = 5000, onClose }: ToastProps) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const icons = {
    success: <CheckCircle size={18} className="text-green-500" />,
    error: <AlertCircle size={18} className="text-error" />,
    warning: <AlertTriangle size={18} className="text-warning" />,
    info: <Info size={18} className="text-primary-light" />,
  };

  const backgrounds = {
    success: 'bg-white border-l-4 border-green-500',
    error: 'bg-white border-l-4 border-error',
    warning: 'bg-white border-l-4 border-warning',
    info: 'bg-white border-l-4 border-primary-light',
  };

  const titles = {
    success: title || 'Success',
    error: title || 'Error',
    warning: title || 'Warning',
    info: title || 'Information',
  };

  return (
    <div
      className={`
        flex items-start gap-3 w-80 p-4 rounded-lg shadow-lg
        ${backgrounds[type]} animate-slide-up
      `}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 text-sm">{titles[type]}</p>
        <p className="text-gray-600 text-sm mt-0.5 break-words">{message}</p>
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Close"
      >
        <X size={16} />
      </button>
    </div>
  );
};